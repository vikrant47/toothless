import { FIELD_TYPES } from '@/modules/engine/core/engine.field';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export const FieldTypeWidget = {
  [FIELD_TYPES.STRING]: {
    widgetAlias: WIDGETS.input,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.ENUM]: {
    widgetAlias: WIDGETS.select,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
    slot: {},
  },
  [FIELD_TYPES.BOOLEAN]: {
    widgetAlias: WIDGETS.switch,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.TEXT]: {
    widgetAlias: WIDGETS.input,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.FILE]: {
    widgetAlias: WIDGETS.input,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.DATE_TIME]: {
    widgetAlias: WIDGETS.date,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.DATE]: {
    widgetAlias: WIDGETS.date,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.INTEGER]: {
    widgetAlias: WIDGETS.number,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.BIG_INTEGER]: {
    widgetAlias: WIDGETS.number,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.REFERENCE]: {
    widgetAlias: WIDGETS.reference,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
  [FIELD_TYPES.UUID]: {
    widgetAlias: WIDGETS.input,
    fieldSettings: {
      showLabel: false,
    },
    widgetSettings: { span: 24 },
  },
};
