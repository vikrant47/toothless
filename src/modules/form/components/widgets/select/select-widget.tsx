import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';

export default class SelectWidget extends BaseWidget {
  palletSettings = {
    label: 'Select',
    icon: 'select',
  }

  overrideConfigSection(configSectionWidgets) {
    Object.assign(configSectionWidgets, {
      'fieldSettings.multiple': {
        fieldName: 'fieldSettings.multiple',
        widgetAlias: WIDGETS.switch,
        fieldSettings: {},
        widgetSettings: {
          labelWidth: 100,
          span: 24,
          label: 'Multiple',
          advance: true,
        },
      },
    });
    if (!this.isWidgetWithField()) {
      return Object.assign(configSectionWidgets, {
        'slot.options': {
          fieldName: 'slot.options',
          widgetAlias: WIDGETS.repeater,
          widgetSettings: {
            span: 24,
            label: 'Choices',
            advance: true,
            repeaterConfig: {
              widgets: [
                {
                  fieldName: 'label',
                  designMode: false,
                  widgetAlias: WIDGETS.input,
                  widgetSettings: {
                    span: 24,
                    label: 'Label',
                    required: true,
                  },
                },
                {
                  fieldName: 'value',
                  designMode: false,
                  widgetAlias: WIDGETS.input,
                  span: 24,
                  widgetSettings: {
                    span: 24,
                    label: 'Value',
                    required: true,
                  },
                },
              ],
            },
          },
        },
      });
    }
    return configSectionWidgets;
  }

  overrideFieldSettings(fieldSettings) {
    return Object.assign(
      {
        multiple: false,
        collapseTags: false,
        clearable: true,
        filterable: true,
        allowCreate: false,
        defaultFirstOption: false,
      },
      fieldSettings
    );
  }

  slot = {
    options: [],
  }

  options(h, key) {
    const list: any[] = [];
    if (this.slot.options) {
      if (typeof this.slot.options === 'string') {
        this.slot.options = JSON.parse(this.slot.options);
      }
      this.slot.options.forEach((item: any) => {
        list.push(
          <el-option
            label={item.label}
            value={item.value}
            disabled={item.disabled}
          />
        );
      });
    }
    return list;
  }

  componentRender(component, h) {
    const config = this.getComponentConfig();
    Object.assign(config, {filterable: true});
    return h('el-select', config, this.getChildren(h));
  }
}
