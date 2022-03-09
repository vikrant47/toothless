import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class SliderWidget extends BaseWidget {
  palletSettings = {
    label: 'Slider',
    icon: 'slider',
  }

  componentRender(component, h) {
    return h(
      'el-slider',
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
