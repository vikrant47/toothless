import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class NumberWidget extends BaseWidget {
  overrideWidgetSettings() {
    return {
      defaultValue: 0,
    };
  }

  palletSettings = {
    label: 'number',
    icon: 'number',
  }

  componentRender(component, h) {
    return h(
      'el-input-number',
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
