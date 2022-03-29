import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { ITEM_LAYOUT } from '@/modules/form/components/widgets/base-widget/widget-config';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import { Engine } from '@/modules/engine/core/engine';
import {ElRow} from "element-plus";

export default class RowWidget extends BaseWidget {
  constructor() {
    super();
    this.fieldName = Engine.generateUniqueString('row');
  }
  palletSettings = {
    label: 'Row',
    icon: 'row',
  }
  widgetSettings = {
    layout: ITEM_LAYOUT.rowFormItem,
    children: [],
    containsChild: true,
    span: 24,
  }

  overrideConfigSection(configSectionWidgets) {
    return {
      'widgetSettings.label': {
        fieldName: 'widgetSettings.label',
        widgetAlias: WIDGETS.input,
        widgetSettings: {
          span: 24,
          label: 'Label',
          required: true,
        },
      },
      'widgetSettings.span': {
        fieldName: 'widgetSettings.span',
        widgetAlias: WIDGETS.number,
        widgetSettings: {
          span: 24,
          label: 'Span',
          min: 0,
          max: 100,
        },
      },
      'fieldSettings.icon': {
        fieldName: 'fieldSettings.icon',
        widgetAlias: WIDGETS.icon,
        widgetSettings: {
          span: 24,
          label: 'Icon',
        },
      },
      'fieldSettings.disabled': {
        widgetAlias: WIDGETS.switch,
        fieldName: 'fieldSettings.disabled',
        widgetSettings: {
          span: 24,
          label: 'Disabled',
          default: false,
        },
      },
      'widgetSettings.triggers': {
        fieldName: 'widgetSettings.triggers',
        widgetAlias: WIDGETS.repeater,

        widgetSettings: {
          labelWidth: 0,
          repeaterConfig: {
            widgets: [
              {
                fieldName: 'action',
                widgetSettings: {
                  labelWidth: 0,
                  span: 24,
                  label: 'Action',
                },
                widgetAlias: WIDGETS.select,

                slot: {
                  options: [
                    {
                      label: 'Show',
                      value: 'show',
                    },
                    {
                      label: 'Hide',
                      value: 'hide',
                    },
                  ],
                },
              },
              {
                fieldName: 'condition',
                widgetAlias: WIDGETS.input,

                fieldSettings: {
                  type: 'textarea',
                },
                widgetSettings: {
                  labelWidth: 0,
                  span: 24,
                  label: 'Action',
                },
              },
            ],
          },
          advance: true,
          label: 'Triggers',
          language: 'javascript',
          parse: true,
        },
      },
    };
  }

  componentRender(component, h) {
    return h(ElRow, {}, this.getChildren());
  }
}
