import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import {ElColorPicker} from "element-plus";

export default class colorPickerWidget extends BaseWidget {
  palletSettings = {
    label: 'Color Picker',
    icon: 'color-picker',
  }

  componentRender(component, h) {
    return h(
      ElColorPicker,
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
