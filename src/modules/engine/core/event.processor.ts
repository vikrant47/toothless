export class EventProcessor {
  static DEFAULT_CONTEXT = {}

  static buildContext(context = {}) {
    return Object.assign({}, context, this.DEFAULT_CONTEXT);
  }

  static eval(script) {
    return eval(script);
  }

  static evalFunction(func) {
    return Function(`return ${func}`)();
  }

  settings = {
    handler: 'function(event,context){}',
  }

  constructor(settings = {}) {
    this.settings = Object.assign(this.settings, settings);
  }

  process(event, context) {
    const handler = EventProcessor.evalFunction(this.settings.handler);
    return handler.call(this, event, EventProcessor.buildContext(context));
  }
}
