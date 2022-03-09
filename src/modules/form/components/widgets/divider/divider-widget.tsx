import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';

export default class DividerWidget extends BaseWidget {
  palletSettings = {
    label: 'Divider',
    icon: 'divider',
  }
  fieldSettings = {
    contentPosition: 'center',
    direction: 'horizontal',
  }
  widgetSettings: any = {
    showLabel: false,
  }

  componentRender(component, h) {
    return h(
      'el-divider',
      this.getComponentConfig(component),
      this.widgetSettings.label
    );
  }
}
