export const LIST_EVENTS = {
  query: {
    prepare: 'query.prepare',
  },
  action: {
    click: 'action.click',
  },
  list: {
    error: 'list.error',
    init: 'list.init',
    beforeRender: 'list.beforeRender',
    afterRender: 'list.afterRender',
    beforeDestroy: 'list.beforeDestroy',
    beforeSubmit: 'list.beforeSubmit',
  },
  definition: {
    beforeFetch: 'definition.beforeFetch',
    fetch: 'definition.fetch',
  },
  cell: {
    click: 'cell.click',
    updateValue: 'widget.updateValue',
    beforeUpdateWidgetConfig: 'widget.updateWidgetConfigs',
    updateWidgetConfig: 'widget.updateWidgetConfigs',
    error: 'widget.error',
  },
  model: {
    beforeFetch: 'model.beforeFetch',
    beforeSave: 'model.beforeSave',
    beforeCreate: 'model.beforeCreate',
    beforeUpdate: 'model.beforeUpdate',
    beforeDelete: 'model.beforeDelete',
    fetch: 'model.fetch',
    save: 'model.save',
    create: 'model.create',
    update: 'model.update',
    delete: 'model.delete',
  },
};

export class ListEvent {
  name
  list

  constructor(name, list) {
    this.name = name;
    this.list = list;
  }

  getList() {
    return this.list;
  }

  getName() {
    return this.name;
  }
}

export class ListWidgetEvent extends ListEvent {
  name
  widget

  constructor(name, widget, list) {
    super(name, list);
    this.name = name;
    this.list = list;
    this.widget = widget;
  }

  getWidget() {
    return this.widget;
  }
}
