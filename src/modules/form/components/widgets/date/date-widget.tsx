import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import {ElDatePicker} from "element-plus";

export default class DateWidget extends BaseWidget {
  palletSettings = {
    label: 'Date',
    icon: 'date',
  }

  overrideConfigSection(configSectionWidgets) {
    configSectionWidgets['fieldSettings.type'].slot.options = [
      {
        label: 'Date',
        value: 'date',
      },
      {
        label: 'Date Time',
        value: 'datetime',
      },
      {
        label: 'Date Range',
        value: 'daterange',
      },
      {
        label: 'Date Time Range',
        value: 'datetimerange',
      },
      {
        label: 'Month Range',
        value: 'monthrange',
      },
    ];
  }

  overrideFieldSettings(fieldSettings) {
    Object.assign(fieldSettings, {
      type: 'date',
    });
  }

  componentRender(component, h) {
    return h(
     ElDatePicker,
      this.getComponentConfig(component),
      this.getChildren()
    );
  }
}
