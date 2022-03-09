import * as _ from 'lodash';
import {WidgetTypes} from '@/modules/form/components/widgets/base-widget/widget-types';
import {Engine} from '@/modules/engine/core/engine';

export class FormWidgetService {
  static RENDER_KEY_COUNTER = 0
  widgetInstances = {}

  /** Add id and key in widget*/
  createIdAndKey(widget, idGlobal = new Date().getTime()) {
    const widgetSettings = widget.widgetSettings;
    widgetSettings.formId = ++idGlobal;
    widgetSettings.renderKey = `${widgetSettings.formId}${+new Date()}`; // After changing the render Key, the component can be forced to update
    if (widgetSettings.layout === 'colFormItem' && !widget.fieldName) {
      widget.fieldName = `field${idGlobal}`;
    } else if (widgetSettings.layout === 'rowFormItem') {
      widgetSettings.componentName = `row${idGlobal}`;
      !Array.isArray(widgetSettings.children) && (widgetSettings.children = []);
      delete widgetSettings.label; // Row Form Item does not need to configure the label attribute
    }
    if (Array.isArray(widgetSettings.children)) {
      widgetSettings.children = widgetSettings.children.map((childItem) =>
        childItem.createIdAndKey(idGlobal)
      );
    }
    return widget;
  }

  createRenderKey(widget) {
    const widgetSettings = widget.widgetSettings;
    widgetSettings.renderKey = `KEY_${FormWidgetService.RENDER_KEY_COUNTER++}${+new Date()}`;
    if (Array.isArray(widgetSettings.children)) {
      widgetSettings.children = widgetSettings.children.map((childItem) =>
        this.createRenderKey(childItem)
      );
    }
    return widget;
  }

  /** Clone given widget or array of widget*/
  clone(object) {
    if (Array.isArray(object)) {
      return object.map((item) => item.clone());
    }
    return object.clone();
  }

  registerWidget(widgetAlias, type) {
    WidgetTypes[widgetAlias] = type;
  }

  getWidgetByAlias(widgetAlias) {
    return WidgetTypes[widgetAlias];
  }

  getWidgetByClass(widgetClass) {
    return _.values(WidgetTypes).find((type) => type.name === widgetClass);
  }

  serializeWidgets(widgets) {
    return JSON.stringify(widgets.map((widget) => widget.marshall()));
  }

  unserializeWidget(serialized) {
    if (typeof serialized === 'string') {
      serialized = JSON.parse(serialized);
    }
    if (Array.isArray(serialized)) {
      return serialized.map((widget) => this.getWidgetInstance(widget));
    }
    return this.getWidgetInstance(serialized);
  }

  getWidgetInstances(): any {
    if (_.isEmpty(this.widgetInstances)) {
      for (const i in WidgetTypes) {
        this.widgetInstances[i] = new WidgetTypes[i]();
        this.widgetInstances[i].widgetAlias = i;
      }
    }
    return this.widgetInstances;
  }

  getWidgetInstancesAsArray() {
    return Object.values(this.getWidgetInstances());
  }

  cleanWidgets() {
    for (const key in this.widgetInstances) {
      delete this.widgetInstances[key];
    }
  }

  refreshWidgetInstances() {
    this.cleanWidgets();
    return this.getWidgetInstances();
  }

  getWidgetsWithSections() {
    const sections: any = {};
    const widgets: any[] = this.getWidgetInstances();
    for (const widget of widgets) {
      const section = widget.getSection();
      if (!section[section]) {
        sections[section] = [];
      }
      sections[section].push(widget);
    }
    return sections;
  }

  toWidgetInstance(widgets) {
    if (!Array.isArray(widgets)) {
      widgets = [widgets];
    }
    return widgets.map((widget) => this.getWidgetInstance(widget));
  }

  /** Return the widget instance from given json*/
  getWidgetInstance(widgetJSON) {
    if (typeof widgetJSON === 'string') {
      widgetJSON = JSON.parse(widgetJSON);
    }
    let Widget: { new() };
    if (
      typeof widgetJSON.widgetAlias !== 'string' &&
      typeof widgetJSON.widgetClass !== 'string'
    ) {
      throw new Error(
        "Invalid json, widgetAlias / widgetClass key doesn't exists"
      );
    } else if (typeof widgetJSON.widgetAlias === 'string') {
      Widget = this.getWidgetByAlias(widgetJSON.widgetAlias);
    } else {
      Widget = this.getWidgetByClass(widgetJSON.widgetClass);
    }
    if (!Widget) {
      throw new Error(
        'Invalid json,No matching widgetAlias / widgetClass found ' +
        JSON.stringify(widgetJSON)
      );
    }
    widgetJSON = Engine.clone(widgetJSON);
    const widget = Engine.unmarshall(widgetJSON, new Widget());
    // console.log('unmarshelled ', widgetJSON, ' into ', widget);
    /* if (loadConfigSection === true) {
      widgetJSON.loadConfigForConfigSection();
    }*/
    return widget;
  }
}
