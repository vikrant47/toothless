import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import {ElCascader} from "element-plus";

export default class CascaderWidget extends BaseWidget {
  palletSettings = {
    label: 'Cascader',
    icon: 'cascader',
  }

  componentRender(component, h) {
    return h(
      ElCascader,
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
