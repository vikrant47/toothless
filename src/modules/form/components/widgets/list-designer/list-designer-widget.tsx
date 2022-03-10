import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
import {ITEM_LAYOUT} from '@/modules/form/components/widgets/base-widget/widget-config';
import ListDesigner from '@/modules/form/components/widgets/list-designer/ListDesigner.vue';

export default class ListDesignerWidget extends BaseWidget {
  init() {
    // this.transient.push({ widgetSettings: ['pallet'] });
    Object.assign(this.widgetSettings, {
      span: 24,
      pallet: [],
      layout: ITEM_LAYOUT.colFormItem,
    });
  }

  palletSettings = {
    label: 'List Designer',
    icon: 'list',
  }

  clearPallets() {
    this.widgetSettings.pallet.length = 0;
    return this;
  }

  addPallet(pallet) {
    this.widgetSettings.pallet.push(pallet);
    return this;
  }

  overrideWidgetSettings(w) {
    /* const FormWidgetService = require('@/modules/form/services/form.widget.service').FormWidgetService;
   widgetSettings.pallet.push({
     title: 'Custom',
     list: new FormWidgetService().getWidgetInstancesAsArray()
   });*/
  }

  getPallet(widgetSettings) {
    return widgetSettings.pallet;
  }

  componentRender(component, h) {
    const config = this.getComponentConfig();
    if (this.designMode) {
      return h('div', {
        domProps: {
          innerHTML: '<h3>List Designer</h3>',
        },
        class: {},
        style: {
          width: '500px',
        },
      });
    } else {
      const value = this.getValue() || {widgets: []};
      /* if (config.attrs.value && config.attrs.value.widgets) {
        const widgets = [];
        const fields = this.getForm().getFieldsByKey('id');
        for (const widget of config.attrs.value.widgets) {
          widgets.push(Engine.clone(fields[widget.id]));
        }
        value.widgets = widgets;
      }*/
      return h(
        ListDesigner,
        {
          on: {
            input: (value) => {
              this.setValue(value, false);
            },
          },
          props: {
            value: value,
            pallet: this.getPallet(config),
          },
        },
        this.getChildren()
      );
    }
  }
}
