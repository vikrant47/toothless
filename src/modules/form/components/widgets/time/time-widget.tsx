import {BaseWidget} from '@/modules/form/components/widgets/base-widget/base-widget';

export default class TimeWidget extends BaseWidget {
  palletSettings = {
    label: 'Time',
    icon: 'time',
  }
  private type: string;

  constructor(settings = {}) {
    super();
    settings = Object.assign(
      {
        pickerOptions: {
          // start: '08:30',
          // step: '00:15',
          // end: '18:30',
          // selectableRange: '18:30:00 - 20:30:00'
        },
      },
      settings
    );
  }

  buildTimeRangeComponents(component, h) {
    const attrs = this.getComponentConfig(component);
    const fromAttrs = Object.assign({}, attrs, {
      start: attrs['fromStart'],
      steps: attrs['formSteps'],
      end: attrs['fromEnd'],
      selectableRange: attrs['fromSelectableRange'],
    });
    const toAttrs = Object.assign({}, attrs, {
      start: attrs['fromStart'],
      steps: attrs['formSteps'],
      end: attrs['fromEnd'],
      selectableRange: attrs['fromSelectableRange'],
    });
    return [
      h('el-time-select', {attrs: fromAttrs}),
      h('el-time-select', {attrs: toAttrs}),
    ];
  }

  componentRender(component, h) {
    if (this.type === 'timerange') {
      h(
        'div',
        {class: {'time-range': true}},
        this.buildTimeRangeComponents(component, h)
      );
    }
    return h(
      'time-select',
      this.getComponentConfig(component),
      this.getChildren(component)
    );
  }
}
