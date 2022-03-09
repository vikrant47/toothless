import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';
// import CronInput from 'vue-cron-generator/src/components/cron-input'
import cronstrue from 'cronstrue';

export default class colorPickerWidget extends BaseWidget {
  palletSettings = {
    label: 'Color Picker',
    icon: 'color-picker',
  }

  getEvents() {
    const _this = this;
    return {
      change(value) {
        _this.setValue(value);
      },
    };
  }

  componentRender(component, h) {
    const config = this.getComponentConfig(component);
    return h('div', {class: 'crontab-wrapper'}, [
     //  h(CronInput, config, this.getChildren()),
      h(
        'div',
        {class: 'crontab-detail'},
        cronstrue.toString(this.getValue())
      ),
    ]);
  }
}
