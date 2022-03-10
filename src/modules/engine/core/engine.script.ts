import {Engine} from '@/modules/engine/core/engine';

export class EngineScript {
  id
  name
  alias
  script
  compiled
  private static defaultContext: any;

  constructor(settings = {}) {
    Object.assign(this, settings);
    if (!this.id) {
      this.id = Engine.generateUniqueString();
    }
  }

  static compile(script) {
    if (typeof script === 'function') {
      return script;
    }
    return new Function(`
    "use strict";
    return ${script.trim()}
    `)();
  }

  static emptyThrowableScript() {
    return new EngineScript({
      script: `()=>{throw new Error('Script not defined');}`,
    });
  }

  static emptyScript() {
    return new EngineScript({script: `()=>{}`});
  }

  static async loadDefaultContext() {
    this.defaultContext = (await import('@/modules/engine/context/index')).default;
  }

  static buildContext(context = {}, self) {
    return Object.assign(
      {self: self},
      this.defaultContext,
      context,
    );
  }

  compile() {
    this.script = EngineScript.compile(this.script);
    this.compiled = true;
    return this;
  }

  execute(event, context = {}) {
    if (!this.compiled) {
      this.compile();
    }
    context = EngineScript.buildContext(context, this);
    if (typeof this.script === 'function') {
      return this.script(event, context);
    } else if (typeof this.script === 'object' && this.script.handler) {
      return this.script.handler(event, context);
    }
    throw new Error('Invalid script no handler found ' + this.script);
  }
}
