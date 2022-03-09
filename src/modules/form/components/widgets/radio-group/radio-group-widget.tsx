import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';

export default class RadioGroupWidget extends BaseWidget {
  palletSettings = {
    label: 'Radio',
    icon: 'radio',
  }

  options(h, key) {
    const list: any[] = [];
    this.slot.options.forEach((item) => {
      if (this.widgetSettings.optionType === 'button') {
        list.push(
          <el-radio-button label={item.value}>{item.label}</el-radio-button>
        );
      } else {
        list.push(
          <el-radio label={item.value} border={this.fieldSettings.border}>
            {item.label}
          </el-radio>
        );
      }
    });
    return list;
  }

  componentRender(component, h) {
    return h(
      'el-radio-group',
      this.getComponentConfig(component),
      this.getChildren(h)
    );
  }
}
