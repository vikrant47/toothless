import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class ButtonWidget extends BaseWidget {
  fieldSettings = { type: 'primary' }

  palletSettings = {
    label: 'Button',
    icon: 'button',
  }

  getChildren(h) {
    return 'Button';
  }

  componentRender(component, h) {
    return h(
      'el-button',
      this.getComponentConfig(component),
      this.getChildren(h)
    );
  }
}
