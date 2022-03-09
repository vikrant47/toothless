import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';

export default class CheckboxGroupWidget extends BaseWidget {
  palletSettings = {
    label: 'Checkbox',
    icon: 'checkbox',
  }

  options(h, key) {
    const list: any[] = [];
    this.slot.options.forEach((item) => {
      if (this.widgetSettings.optionType === 'button') {
        list.push(
          <el-checkbox-button label={item.value}>
            {item.label}
          </el-checkbox-button>
        );
      } else {
        list.push(
          <el-checkbox label={item.value} border={this.fieldSettings.border}>
            {item.label}
          </el-checkbox>
        );
      }
    });
    return list;
  }

  componentRender(component, h) {
    return h(
      'el-checkbox',
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
