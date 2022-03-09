import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class CascaderWidget extends BaseWidget {
  palletSettings = {
    label: 'Cascader',
    icon: 'cascader',
  }

  componentRender(component, h) {
    return h(
      'el-cascader',
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
