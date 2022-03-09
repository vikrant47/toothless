import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class SwitchWidget extends BaseWidget {
  palletSettings = {
    label: 'Switch',
    icon: 'switch',
  }

  componentRender(component, h) {
    return h(
      'el-switch',
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
