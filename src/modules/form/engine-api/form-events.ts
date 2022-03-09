export const FORM_EVENTS = {
  form: {
    error: 'form.error',
    init: 'form.init',
    beforeRender: 'form.beforeRender',
    afterRender: 'form.afterRender',
    beforeDestroy: 'form.beforeDestroy',
    beforeSubmit: 'form.beforeSubmit',
  },
  definition: {
    beforeFetch: 'definition.beforeFetch',
    fetch: 'definition.fetch',
  },
  widget: {
    init: 'widget.init',
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

export class FormEvent {
  name
  form

  constructor(name, form) {
    this.name = name;
    this.form = form;
  }

  getForm() {
    return this.form;
  }

  getName() {
    return this.name;
  }
}

export class WidgetEvent extends FormEvent {
  name
  widget

  constructor(name, widget, form) {
    super(name, form);
    this.name = name;
    this.form = form;
    this.widget = widget;
  }

  getWidget() {
    return this.widget;
  }
}
