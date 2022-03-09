import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class RateWidget extends BaseWidget {
  palletSettings = {
    label: 'Rating',
    icon: 'rate',
  }

  componentRender(component, h) {
    return h('el-rate', this.getComponentConfig(component), this.getChildren());
  }
}
