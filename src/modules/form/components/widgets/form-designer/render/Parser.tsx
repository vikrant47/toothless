import _ from 'lodash';
import {TemplateEngine} from '@/modules/engine/core/template.engine';
import {FormWidgetService} from '@/modules/form/services/form.widget.service';
import {EngineForm} from '@/modules/form/engine-api/engine.form';
import {
  FORM_EVENTS,
  FormEvent,
  WidgetEvent,
} from '@/modules/form/engine-api/form-events';
import {Engine} from '@/modules/engine/core/engine';
import {loadWidget} from "@/modules/form/components/widgets/base-widget/widget-types";
import render from '@/modules/form/components/widgets/form-designer/render/render';
import {defineComponent} from 'vue'

const ruleTrigger = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change',
};
const layouts = {
  colFormItem(h, widget) {
    const formData = Engine.clone(this.formData); // todo : make it better , we only need value against field name
    /* if (!(widget instanceof BaseWidget)) {
      widget = new FormWidgetService().getWidgetInstance(widget);
    }
    widget.setFormModel(this.formModel);*/
    const widgetInstance = getWidgetInstance.call(this, widget);
    widgetInstance.designMode = false;
    // widgetInstance.reset(widget);
    widgetInstance.setData(this.widgetData[widgetInstance.fieldName] || {});
    const listeners = buildListeners.call(this, widgetInstance);
    const child = renderChildren.apply(this, [h, widget]);
    widgetInstance.setPreviewMode(this.previewMode);
    return (
      <render
        widget={widgetInstance}
        {...listeners}
        wrapper={true}
        form-model={formData}
        eval-context={this.context}
      >
        {child}
      </render>
      /* <el-col span={widgetSettings.span} v-show={widgetSettings.visible}>
          <el-form-item label-width={labelWidth} prop={widget.fieldName}
            label={widgetSettings.showLabel ? widgetSettings.label : ''} required={widgetSettings.required}>
            <render widget={widgetInstance} {...{ on: listeners }} form-model={this.formData} eval-context={this.evalContext} />
          </el-form-item>
        </el-col>*/
    );
  },
  rowFormItem(h, widget) {
    const widgetSettings = widget.widgetSettings;
    let child = renderChildren.apply(this, [h, widget]);
    if (widgetSettings.type === 'flex') {
      child = (
        <el-row
          type={widgetSettings.type}
          justify={widgetSettings.justify}
          align={widgetSettings.align}
          /* class={this.widgetSettings.visible ? 'visible' : 'hidden'}*/
        >
          <el-card>{child}</el-card>
        </el-row>
      );
    }
    return (
      <el-col span={widgetSettings.span}>
        <el-row
          gutter={
            widgetSettings.gutter
          } /* class={widgetSettings.visible ? 'visible' : 'hidden'}*/
        >
          <el-card class='widget-row-card box-card'>
            <div v-slot:headerclass='clearfix'>
              <span>{widgetSettings.label}</span>
            </div>
            {child}
          </el-card>
        </el-row>
      </el-col>
    );
  },
};

function renderFrom(h) {
  const {formConf} = this;

  return (
    <div
      class={
        this.containsSection
          ? 'form-parser form-parser-with-sections'
          : 'form-parser'
      }
    >
      <el-form size={formConf.size}
               label-position={formConf.labelPosition}
               disabled={formConf.disabled}
               label-width={`${formConf.labelWidth}px`}
               ref={formConf.formRef}
        // model cannot be assigned directly https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
               props={{model: this.formData}}
               rules={this[formConf.formRules]}
      >
        <el-row gutter={formConf.gutter}>
          {renderFormItem.call(this, h, formConf.widgets, this.formModel)}
          {formConf.formBtns && formBtns.call(this, h)}
        </el-row>
      </el-form>
    </div>
  );
}

function formBtns(h) {
  return (
    <el-col>
      <el-form-item size='large'>
        <el-button type='primary' onClick={this.submitForm}>
          提交
        </el-button>
        <el-button onClick={this.resetForm}>Reset</el-button>
      </el-form-item>
    </el-col>
  );
}

function renderFormItem(h, elementList, formModel) {
  return elementList.map((widget) => {
    const config = widget.widgetSettings || {};
    const layout = layouts[config.layout || 'colFormItem'];

    if (layout) {
      return layout.call(this, h, widget, formModel);
    }
    throw new Error(`No layout fount with ${config.layout} name`);
  });
}

function renderChildren(h, widget) {
  const config = widget.widgetSettings;
  if (!Array.isArray(config.children)) return null;
  return renderFormItem.call(this, h, config.children);
}

function getWidgetInstance(widgetJson) {
  const fieldName = widgetJson.fieldName;
  if (!this.$options.widgets[fieldName]) {
    this.engineForm.fillFieldConfig(fieldName, widgetJson);
    const widgetInstance = new FormWidgetService().getWidgetInstance(widgetJson);
    widgetInstance.setFormId(this.engineForm.getId());
    this.engineForm.addWidgetRef(widgetInstance);
    widgetInstance.setForm(this.engineForm);
    widgetInstance.init();
    this.$options.widgets[fieldName] = widgetInstance;
    this.engineForm.triggerProcessors(
      new WidgetEvent(FORM_EVENTS.widget.init, widgetInstance, widgetJson),
      {}
    );
  }
  return this.$options.widgets[fieldName];
}

let widgetUpdateQueue = {};
const debouncedCallbacks = {
  bulkUpdate: _.debounce((xthis) => {
    if (Object.keys(widgetUpdateQueue).length > 0) {
      for (const fieldName in widgetUpdateQueue) {
        const widgetInfo = widgetUpdateQueue[fieldName];
        setValue.call(xthis, widgetInfo.value, {}, widgetInfo.widget);
      }
    }
    widgetUpdateQueue = {};
  }, 100),
};

function bulkUpdateValue(value, config, widget) {
  widgetUpdateQueue[widget.fieldName] = {widget, value};
  debouncedCallbacks.bulkUpdate(this);
}

function setValue(event, config, widget) {
  nextTick(() => {
    if (typeof event !== 'undefined') {
      const previousValue = _.get(this.formData, widget.fieldName);
      // config[ 'defaultValue'] =  event;
      if (previousValue !== event) {
        // TODO: handle concurrent field value update here using debounce
        if (widget.fieldName.indexOf('.') > 0) {
          const result = TemplateEngine.walk(widget.fieldName, this.formData, -1);
          result.value[result.prop] = event;
          // delete this.formData[widget.fieldName];
        } else {
          this.formData[widget.fieldName] = event;
        }
        this.engineForm.setRecord(this.formData);
        this.$emit('fieldValueUpdated', widget, event);
        this.engineForm.triggerProcessors(
          new WidgetEvent(FORM_EVENTS.widget.updateValue, widget, {
            previous: previousValue,
            current: event,
            value: event,
          }),
          {}
        );
      }
    }
  })
}

function setWidgetData(event, config, widget) {
  this.widgetData[widget.fieldName] = event;
  // this[ 'formKey'] =  new Date().getTime();// forcing re-render
}

function buildListeners(widget) {
  const config = widget.widgetSettings;
  const methods = this.formConf.__methods__ || {};
  const listeners = {};

  // Bind this and event to the methods in __methods__
  Object.keys(methods).forEach((key) => {
    listeners[key] = (event) => methods[key].call(this, event);
  });
  // response render.js Neutral vModel $emit('input', val)
  listeners.onBulk_input_update = (event) =>
    bulkUpdateValue.call(this, event, config, widget);
  listeners.onInput_update = (event) => setValue.call(this, event, config, widget);
  listeners['widget-data'] = (event) =>
    setWidgetData.call(this, event, config, widget);

  return listeners;
}

export default defineComponent({
  name: 'Parser',
  components: {
    render,
  },
  props: {
    engineForm: {
      type: EngineForm,
      required: true,
    },
    evalContext: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      containsSection: false,
      widgetData: {},
      // formData: this.engineForm.getRecord(),
      formConf: this.engineForm.getFormConfig(),
      context: Object.assign({form: this.engineForm}, this.evalContext),
      previewMode: this.engineForm.settings.previewMode,
    };
  },
  computed: {
    formData: {
      get() {
        return this.engineForm.getRecord();
      },
      set(newValue) {
        // this.engineForm.setRecord(newValue);
      },
    },
  },
  async mounted() {
    await loadWidget();
    if (!this.formConf.rules) {
      this.formConf.rules = {};
    }
    const record = await this.engineForm.waitFor(FORM_EVENTS.model.fetch);
    this.formData = record[0];
    this.$emit('beforeInit');
    this.initFormData(this.formConf.widgets, this.formData);
    this.buildRules(this.formConf.widgets, this.formConf.rules);
    this.containsSection = this.engineForm.containsSection();
    // await this.engineForm.triggerProcessors(new FormEvent(FORM_EVENTS.form.init), {});
  },
  created() {
    // access the custom option using $options
    this.$options.widgets = {};
  },
  methods: {
    initFormData(widgets, formModel) {
      widgets.forEach((widget) => {
        // widget.setFormModel(this.formConf.model);
        const {widgetSettings} = widget;
        const value = _.get(formModel, widget.fieldName);
        if (
          widget.fieldName &&
          (typeof value === 'undefined' || value === null)
        ) {
          _.set(formModel, widget.fieldName, widgetSettings.defaultValue);
        }
        if (widgetSettings.children) {
          this.initFormData(widgetSettings.children, formModel);
        }
      });
    },
    buildRules(componentList, rules) {
      componentList.forEach((widget) => {
        const config = widget.widgetSettings;
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = {
              required: config.required,
              message: widget.placeholder,
            };
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array';
              required.message = `Please select at least one ${config.label}`;
            }
            required.message === undefined &&
            (required.message = `${config.label} Can not be empty`);
            config.regList.push(required);
          }
          rules[widget.fieldName] = config.regList.map((item) => {
            // eslint-disable-next-line no-eval
            item.pattern && (item.pattern = eval(item.pattern));
            item.trigger = ruleTrigger && ruleTrigger[config.widget];
            return item;
          });
        }
        if (config.children) this.buildRules(config.children, rules);
      });
    },
    resetForm() {
      // this.formConf = deepClone(this.formConf);
      this.$refs[this.formConf.formRef].resetFields();
    },
    submitForm() {
      this.$refs[this.formConf.formRef].validate((valid) => {
        if (!valid) return false;
        // TriggerTheSubmitEvent
        this.engineForm.triggerProcessors(
          new FormEvent(FORM_EVENTS.form.beforeSubmit, this.formData),
          {}
        );
        this.$emit('submit', this.formData);
        return true;
      });
    },
  },
  render(h) {
    return renderFrom.call(this, h);
  },
});
