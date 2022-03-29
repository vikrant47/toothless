import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import FormDesigner from '@/modules/form/components/widgets/form-designer/designer/FormDesigner.vue';
import { ITEM_LAYOUT } from '@/modules/form/components/widgets/base-widget/widget-config';

export default class FormDesignerWidget extends BaseWidget {
  init() {
    // this.transient.push({ widgetSettings: ['pallet'] });
    Object.assign(this.widgetSettings, {
      span: 24,
      pallet: [],
      layout: ITEM_LAYOUT.colFormItem,
    });
  }

  palletSettings = {
    label: 'Form Designer',
    icon: 'form',
  }

  clearPallets() {
    this.widgetSettings.pallet = [];
    return this;
  }

  addPallet(pallet) {
    this.widgetSettings.pallet.push(pallet);
    return this;
  }

  overrideWidgetSettings(widgetSettings) {
    const FormWidgetService =
      require('@/modules/form/services/form.widget.service').FormWidgetService;
    widgetSettings.pallet.push({
      title: 'Custom',
      list: new FormWidgetService().getWidgetInstancesAsArray(),
    });
    return widgetSettings;
  }

  getPallet(widgetSettings) {
    const FormWidgetService =
      require('@/modules/form/services/form.widget.service').FormWidgetService;
    return widgetSettings.pallet.map((entry) => {
      entry.list = entry.list.map((widget) => {
        if (!(widget instanceof BaseWidget)) {
          widget = new FormWidgetService().getWidgetInstance(widget);
        }
        return widget;
      });
      return entry;
    });
  }

  componentRender(component, h) {
    const config = this.getComponentConfig();
    if (this.designMode) {
      return h('div', {
        domProps: {
          innerHTML: '<h3>Form Designer</h3>',
        },
        class: {},
        style: {
          width: '500px',
        },
      });
    } else {
      return h(
        FormDesigner,
        {
          on: {
            input: (value) => {
              this.setValue(value, false);
              console.log('Value updated ', value, this.fieldName);
            },
          },
          props: {
            value: config.value,
            pallet: this.getPallet(config),
          },
        },
        this.getChildren()
      );
    }
  }
}
