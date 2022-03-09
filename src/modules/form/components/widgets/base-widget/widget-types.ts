import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';

export let WidgetTypes;
export const loadWidget = async () => {
  if (!WidgetTypes) {
    WidgetTypes = {
      [WIDGETS.input]: await import('../input/input-widget'),
      [WIDGETS.number]: await import('../number/number-widget'),
      [WIDGETS.richeditor]: await import('../richeditor/richeditor-widget'),
      [WIDGETS.select]: await import('../select/select-widget'),
      [WIDGETS.cascader]: await import('../cascader/cascader-widget'),
      [WIDGETS.radioGroup]: await import('../radio-group/radio-group-widget'),
      [WIDGETS.checkboxGroup]: await import('../checkbox-group/checkbox-group-widget'),
      [WIDGETS.switch]: await import('../switch/switch-widget'),
      [WIDGETS.row]: await import('../row/row-widget'),
      [WIDGETS.time]: await import('../time/time-widget'),
      [WIDGETS.timeRange]: await import('../time-range/time-range-widget'),
      [WIDGETS.date]: await import('../date/date-widget'),
      [WIDGETS.button]: await import('../button/button-widget'),
      [WIDGETS.rate]: await import('../rate/rate-widget'),
      [WIDGETS.colorPicker]: await import('../color-picker/color-picker-widget'),
      [WIDGETS.formDesigner]: await import('../form-designer/form-designer-widget'),
      [WIDGETS.listDesigner]: await import('../list-designer/list-designer-widget'),
      [WIDGETS.reference]: await import('../reference/reference-widget'),
      [WIDGETS.icon]: await import('../icon-picker/icon-picker-widget'),
      [WIDGETS.divider]: await import('../divider/divider-widget'),
      [WIDGETS.repeater]: await import('../repeater/repeater-widget'),
      [WIDGETS.codeEditor]: await import('../code-editor/code-editor-widget'),
      [WIDGETS.fileUpload]: await import('../fileupload/file-upload-widget'),
      [WIDGETS.multiReference]: await import('../multi-reference/multi-reference-widget'),
      [WIDGETS.fileReference]: await import('../file-reference/file-reference-widget'),
      [WIDGETS.queryBuilder]: await import('../query-builder/query-builder-widget'),
      [WIDGETS.crontab]: await import('../crontab/crontab-widget'),
    }
  }
  return WidgetTypes;
}
export const getWidget = async (widget?: WIDGETS) => {
  await loadWidget();
  if (!widget) {
    return WidgetTypes;
  }
  return await WidgetTypes[widget];
}
