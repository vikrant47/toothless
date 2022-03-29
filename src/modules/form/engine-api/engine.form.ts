import {RestQuery} from '@/modules/engine/services/rest.query';
import $router from '@/router';
import {Engine} from '@/modules/engine/core/engine';
import {ModelService} from '@/modules/engine/services/model.service';
import {FORM_EVENTS, FormEvent} from '@/modules/form/engine-api/form-events';
import * as _ from 'lodash';
import {FormWidgetService} from '@/modules/form/services/form.widget.service';
import {EngineDefinitionService} from '@/modules/engine/core/engine.definition.service';
import {
  LAYOUT_WIDGETS,
  WIDGETS,
} from '@/modules/form/components/widgets/base-widget/widgets';

export class EngineForm extends EngineDefinitionService {
  id: string;
  record: any = {}
  definition: any = {
    form: {
      config: {tabs: {}},
      actions: [],
      processors: [],
      relatedRecords: [],
    },
    fields: [],
  }
  formConfig: any = {
    widgets: [],
    labelSuffix: '',
    labelWidth: '100',
    labelPosition: 'right',
    formModel: 'formModel', // name of the for model key
    formRules: 'formRules', // name of the form rules key
  }
  settings: any = {
    recordId: 'new',
    showLoader: true,
    loaderDelay: 30,
    previewMode: false,
  }
  original: any = {}
  relatedRecords: any[] = []

  static navigate(
    modelAlias,
    formId = 'default',
    recordId = 'new',
    context = 'create'
  ) {
    $router.replace(
      '/models/' +
      modelAlias +
      '/form/' +
      formId +
      '/' +
      recordId +
      '?context = ' +
      context
    );
  }

  constructor(settings: any = {}) {
    super();
    this.id = Engine.generateUniqueString();
    this.settings = Object.assign(this.settings, settings);
    this.modelAlias = this.settings.modelAlias;
    if (this.settings.formConfig) {
      this.definition.form.config = this.settings.formConfig;
    }
    this.registerEvents();
  }

  getId() {
    return this.id;
  }

  static parseFieldValueByType(field, value) {
    if (typeof value !== 'undefined') {
      let parsedValue: any = value;
      switch (field.type) {
        case 'string':
          parsedValue = value + '';
          break;
        case 'json':
          parsedValue =
            typeof parsedValue === 'string'
              ? JSON.parse(parsedValue)
              : parsedValue;
          break;
        case 'boolean':
          parsedValue =
            typeof parsedValue === 'string'
              ? parsedValue === 'true'
              : !!parsedValue;
          break;
        case 'integer':
        case 'bigInteger':
        case 'number':
          parsedValue = typeof parsedValue === 'string' ? (parseInt(parsedValue, 10)) : parsedValue;
          break;
        default:
          parsedValue = value;
          break;
      }
      return parsedValue;
    }
    return value;
  }

  setRecord(record) {
    if (this.isNew()) {
      const fieldNames = this.getSelectedFieldNames();
      for (const fieldName of fieldNames) {
        if (typeof record[fieldName] === 'undefined') {
          const field = this.getFieldByName(fieldName);
          if (
            field &&
            typeof field.default_value !== 'undefined' &&
            field.default_value !== null
          ) {
            record[fieldName] = EngineForm.parseFieldValueByType(
              field,
              field.default_value
            );
          }
        }
      }
    }
    this.record = record;
  }

  getRecord() {
    return this.record;
  }

  getOriginal() {
    return this.original;
  }

  registerEvents() {
  }

  static getAllWidgets(widgetConfig: any[] = []) {
    let widgets: any[] = [];
    for (const widget of widgetConfig) {
      widgets.push(widget);
      if (widget?.widgetSettings?.containsChild === true) {
        widgets = widgets.concat(
          this.getAllWidgets(widget.widgetSettings.children)
        );
      }
    }
    return widgets;
  }

  getSelectedWidgets() {
    return EngineForm.getAllWidgets(this.definition.form.config.widgets).filter(
      (widget) => {
        return LAYOUT_WIDGETS.indexOf(widget.widgetAlias) < 0;
      }
    );
  }

  getSelectedFieldNames() {
    return this.getSelectedWidgets().map((widget) => widget.fieldName);
  }

  populateFormConfig() {
    return {widgets: this.definition.form.config.widgets};
    /* const tabs = this.definition.form.config.tabs || [];
    const widgets = tabs.reduce((result, tab) => result.concat(tab.widgets), []);
    return { widgets };*/
  }

  updateHash() {
    this.hashCode = new Date().getTime();
  }

  populateFields() {
    this.fields = this.definition.fields;
  }

  populateActions() {
    this.actions = this.buildAction(this.definition.form.actions);
  }

  getRelatedRecords() {
    return this.relatedRecords;
  }

  populateRelatedRecords() {
    this.relatedRecords = this.definition.form.relatedRecords.sort(
      (r1, r2) => r1.sort_order - r2.sort_order
    );
  }

  populateProcessors() {
    this.processors = this.buildProcessors(this.definition.form.processors);
  }

  sanitizeDefinition() {
    this.id = this.definition.form.id;
    super.sanitizeDefinition();
    Object.assign(this.formConfig, this.populateFormConfig());
    this.updateHash();
    this.populateFields();
    this.populateActions();
    this.populateProcessors();
    this.populateRelatedRecords();
    return this.definition;
  }

  getFormDefinition() {
    return this.definition.form;
  }

  fillFieldConfig(fieldName, widgetConfig) {
    const field = this.getFieldByName(fieldName);
    if (field) {
      widgetConfig.widgetAlias = widgetConfig.widgetAlias || field.form_renderer;
      widgetConfig.fieldSettings = Object.assign(
        {
          readOnly: field.readonly,
          disabled: field.readonly,
        },
        widgetConfig.fieldSettings
      );
      widgetConfig.widgetSettings = Object.assign(
        {
          label: field.label,
        },
        widgetConfig.widgetSettings
      );
      switch (field.type) {
        case 'reference':
          // assigning default values
          Object.assign(widgetConfig.widgetSettings, {
            display_field_name: field.display_field_name,
            referenced_field_name: field.referenced_field_name,
            referenced_model_alias: field.referenced_model_alias,
          });
          break;
        case 'enum':
          widgetConfig.slot.options = field.choices;
          widgetConfig.fieldSettings.multiple = field.multiple;
          break;
      }
      widgetConfig.fieldRecord = field;
    }
  }

  async loadData() {
    // request record
    await this.emit(FORM_EVENTS.model.beforeUpdate);
    const selectedFields = this.getSelectedFieldNames();
    if (selectedFields.indexOf('id') < 0) {
      selectedFields.push('id');
    }
    const response = await new RestQuery(this.settings.modelAlias).findById(
      this.settings.recordId,
      {
        fields: selectedFields,
        include: this.getIncludeStatement(this.getSelectedFieldNames()),
      }
    );
    this.original = Engine.clone(response.contents);
    this.setRecord(response.contents);
    await this.emit(FORM_EVENTS.model.update);
    return this.record;
  }

  async refresh() {
    try {
      await this.emit(FORM_EVENTS.model.beforeFetch);
      if (this.settings.remote === false || this.settings.recordId === 'new') {
        await this.emit(FORM_EVENTS.model.fetch, this.record);
        return this.record;
      }
      this.enableLoading();
      await this.loadData();
      // time Show table in milliseconds
      setTimeout(async () => {
        this.disableLoading();
        this.emit(FORM_EVENTS.model.fetch, this.getRecord());
        this.triggerProcessors(new FormEvent(FORM_EVENTS.model.fetch, this), {});
      }, this.settings.loaderDelay);
    } catch (err) {
      this.disableLoading();
      this.emit(FORM_EVENTS.form.error, err);
      throw err;
    }
  }

  async loadDefinition() {
    try {
      await this.emit(FORM_EVENTS.definition.beforeFetch);
      if (this.settings.remote === false) {
        this.sanitizeDefinition();
        return;
      }
      this.enableLoading();
      // request data
      const response = await new ModelService(
        this.settings.modelAlias
      ).requestDefinition({
        formId: this.settings.formId,
      });
      this.definition = response.contents;
      this.sanitizeDefinition();
      // time Show table in milliseconds
      setTimeout(() => {
        this.disableLoading();
      }, this.settings.loaderDelay);
      this.emit(FORM_EVENTS.definition.fetch, this.definition);
      this.definitionLoaded = true;
    } catch (err) {
      this.disableLoading();
      this.emit(FORM_EVENTS.form.error, err);
      throw err;
    }
  }

  /** Return pallet for all the fields in form**/
  static getFieldsAsPallet(fields) {
    return {
      title: 'Fields',
      updatable: true,
      list: fields.map((field) =>
        new FormWidgetService().getWidgetInstance({
          id: field.id,
          widgetAlias: field.form_renderer,
          fieldName: field.name,
          immutable_configs: [
            'fieldName',
            'referenced_model_alias',
            'display_field_name',
            'disabled',
            'formModel',
          ],
          widgetSettings: {
            label: field.label,
          },
          palletSettings: {
            label: field.label,
          },
        })
      ),
    };
  }

  /** Returns all of the widgets from definition*/
  getFormConfig() {
    return this.formConfig;
  }

  setFormConfig(formConfig: any = {}) {
    this.definition.form.config = formConfig;
    this.formConfig = formConfig;
  }

  containsSection() {
    return (
      this.formConfig.widgets.filter(
        (widget: any) => widget.widgetAlias === WIDGETS.row
      ).length > 0
    );
  }

  getWidgetConfig() {
    return this.formConfig.widgets;
  }

  setWidgetConfig(widgetConfig) {
    this.emit(FORM_EVENTS);
    this.formConfig.widgets = widgetConfig;
  }

  open() {
  }

  getDirtyFields() {
    return Object.keys(this.getDirty());
  }

  getDirty(updatable = true) {
    const dirty = {};
    const updatableFields = updatable
      ? this.getUpdatableFields()
      : this.getSelectedWidgets().map((widget) => {
        return {name: widget.fieldName};
      });
    const formData = this.getFormData();
    for (const field of updatableFields) {
      if (this.original[field.name] !== formData[field.name]) {
        dirty[field.name] = formData[field.name];
      }
    }
    return dirty;
  }

  getUpdatableFields() {
    return this.getFields().filter((field) => !field.readonly);
  }

  getFormattedRecord() {
    const updatableFields = this.getUpdatableFields().map((field) => field.name);
    const formatted = {};
    const formData = this.getFormData();
    for (const i in formData) {
      if (updatableFields.indexOf(i) >= 0 || i.startsWith('_')) {
        // any field starts with underscore(_) can be pushed
        formatted[i] = formData[i];
      }
    }
    return formatted;
  }

  /** Weather currently opened form is new */
  isNew() {
    return this.settings.recordId === 'new';
  }

  create() {
    return new RestQuery(this.settings.modelAlias).create(
      this.getFormattedRecord()
    );
  }

  update() {
    const formatted = this.getDirty();
    if (Object.keys(formatted).length > 0) {
      return new RestQuery(this.settings.modelAlias).update(formatted, {
        where: {id: this.original.id},
      });
    }
    return {contents: [this.record]};
  }

  /** This will save the form record using api*/
  save() {
    if (this.isNew()) {
      return this.create();
    }
    return this.update();
  }

  /** Delete the current record*/
  delete() {
  }

  setFormData(formData) {
    Object.values(this.$widgetRefs).forEach((widget: any) => {
      widget.setValue(_.get(formData, widget.fieldName));
    });
  }

  reset() {
    Object.values(this.$widgetRefs).forEach((widget: any) => {
      widget.setValue('');
    });
  }

  getFormData() {
    const model = {};
    Object.values(this.$widgetRefs).forEach((widget: any) => {
      _.set(model, widget.fieldName, widget.getValue());
    });
    return model;
  }

  invoke(fieldName, method, args: any[] = []) {
    const widget: any = this.getWidgetRef(fieldName);
    // eslint-disable-next-line prefer-spread
    return widget[method].apply(widget, args);
  }

  getOriginalValue(fieldName) {
    return _.get(this.original, fieldName);
  }

  setModelValue(fieldName, value) {
    return _.set(this.record, fieldName, value);
  }

  getModelValue(fieldName) {
    return _.get(this.record, fieldName);
  }

  isDirty(fieldName) {
    return this.getOriginalValue(fieldName) !== this.getModelValue(fieldName);
  }

  getValue(fieldName) {
    return this.invoke(fieldName, 'getValue');
  }

  setValue(fieldName, value) {
    return this.invoke(fieldName, 'setValue', [value]);
  }

  setRawValue(fieldName, value) {
    this.record[fieldName] = value;
  }

  /**
   * @param {FormEvent} event
   * @param {Object} context
   **/
  async triggerProcessors(event, context = {}) {
    event.form = this;
    return super.triggerProcessors(event, context);
  }
}
