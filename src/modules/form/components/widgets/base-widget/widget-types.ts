import {WIDGETS} from '@/modules/form/components/widgets/base-widget/widgets';

export let WidgetTypes;
export const loadWidget = async () => {
  if (!WidgetTypes) {
    WidgetTypes = {
      [WIDGETS.input]: (await import('../input/input-widget')).default,
      [WIDGETS.number]: (await import('../number/number-widget')).default,
      [WIDGETS.richeditor]: (await import('../richeditor/richeditor-widget')).default,
      [WIDGETS.select]: (await import('../select/select-widget')).default,
      [WIDGETS.cascader]: (await import('../cascader/cascader-widget')).default,
      [WIDGETS.radioGroup]: (await import('../radio-group/radio-group-widget')).default,
      [WIDGETS.checkboxGroup]: (await import('../checkbox-group/checkbox-group-widget')).default,
      [WIDGETS.switch]: (await import('../switch/switch-widget')).default,
      [WIDGETS.row]: (await import('../row/row-widget')).default,
      [WIDGETS.time]: (await import('../time/time-widget')).default,
      [WIDGETS.timeRange]: (await import('../time-range/time-range-widget')).default,
      [WIDGETS.date]: (await import('../date/date-widget')).default,
      [WIDGETS.button]: (await import('../button/button-widget')).default,
      [WIDGETS.rate]: (await import('../rate/rate-widget')).default,
      [WIDGETS.colorPicker]: (await import('../color-picker/color-picker-widget')).default,
      [WIDGETS.formDesigner]: (await import('../form-designer/form-designer-widget')).default,
      [WIDGETS.listDesigner]: (await import('../list-designer/list-designer-widget')).default,
      [WIDGETS.reference]: (await import('../reference/reference-widget')).default,
      [WIDGETS.icon]: (await import('../icon-picker/icon-picker-widget')).default,
      [WIDGETS.divider]: (await import('../divider/divider-widget')).default,
      [WIDGETS.repeater]: (await import('../repeater/repeater-widget')).default,
      [WIDGETS.codeEditor]: (await import('../code-editor/code-editor-widget')).default,
      [WIDGETS.fileUpload]: (await import('../fileupload/file-upload-widget')).default,
      [WIDGETS.multiReference]: (await import('../multi-reference/multi-reference-widget')).default,
      [WIDGETS.fileReference]: (await import('../file-reference/file-reference-widget')).default,
      [WIDGETS.queryBuilder]: (await import('../query-builder/query-builder-widget')).default,
      [WIDGETS.crontab]: (await import('../crontab/crontab-widget')).default,
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
