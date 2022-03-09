import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import { RestQuery } from '@/modules/engine/services/rest.query';
import { Engine } from '@/modules/engine/core/engine';
import QueryBuilder from '@/modules/engine/components/query-builder/QueryBuilder';
import { TemplateEngine } from '@/modules/engine/core/template.engine';

export default class QueryBuilderWidget extends BaseWidget {
  palletSettings = {
    label: 'Icon',
    icon: 'icon',
  }

  overrideConfigSection(configSectionWidgets) {
    return Object.assign(configSectionWidgets, {
      'widgetSettings.model_alias': {
        fieldName: 'widgetSettings.model_alias',
        widgetAlias: WIDGETS.input,
        widgetSettings: {
          labelWidth: 100,
          span: 24,
          label: 'Reference Model',
          advance: true,
        },
      },
      'widgetSettings.showApply': {
        fieldName: 'widgetSettings.showApply',
        widgetAlias: WIDGETS.switch,
        widgetSettings: {
          labelWidth: 100,
          span: 24,
          label: 'Show Apply',
          advance: true,
        },
      },
      'fieldSettings.fields': {
        widgetAlias: WIDGETS.codeEditor,
        fieldName: 'fieldSettings.fields',
        widgetSettings: {
          labelWidth: 0,
          span: 24,
          label: 'Fields',
          required: false,
          language: 'json',
        },
      },
    });
  }

  modelAlias
  fields = []

  mounted() {
    if (this.fieldSettings.fields) {
      if (typeof this.fieldSettings.fields === 'string') {
        this.fieldSettings.fields = JSON.parse(this.fieldSettings.fields);
      }
    }
    return super.mounted();
  }

  async loadFields() {
    if (this.widgetSettings.model_alias) {
      let model = this.widgetSettings.model_alias;
      if (model.startsWith('$')) {
        model = TemplateEngine.evalExpression(model, this.buildContext());
      }
      if (model && this.modelAlias !== model) {
        this.modelAlias = model;
        const result = await new RestQuery('engine_fields').findAll({
          where: {
            [Engine.isUUID(model) ? 'engine_model_id' : 'engine_model_alias']:
              model,
          },
        });
        this.setFields(result.contents);
      }
      return this.fields;
    }
  }

  setFields(fields) {
    this.fieldSettings.fields = fields;
    this.repaint();
  }

  componentRender(component, h) {
    this.loadFields();
    const config = this.getComponentConfig();
    // Object.assign(config.attrs, { fields: config.fields });
    return h(QueryBuilder, config);
  }
}
