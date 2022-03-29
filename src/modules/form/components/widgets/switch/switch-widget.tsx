import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import {ElSwitch} from "element-plus";

export default class SwitchWidget extends BaseWidget {
  palletSettings = {
    label: 'Switch',
    icon: 'switch',
  }

  componentRender(component, h) {
    return h(
      ElSwitch,
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
