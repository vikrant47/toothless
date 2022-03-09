export class EngineObservable {
  eventSeen: any[] = [];
  protected events: any;
  protected waitPromises: any;

  constructor() {
    this.events = {};
    this.waitPromises = {};
  }

  /** This will add event to seen list*/
  visitEvent(event) {
    this.eventSeen.push(event);
  }

  async syncEmit(eventName, ...args) {
    this.visitEvent(eventName);
    this.resolveWaiters(eventName, args);
    await this.syncTriggerCallback(eventName, args);
  }

  emit(eventName, ...args) {
    this.visitEvent(eventName);
    this.resolveWaiters(eventName, args);
    this.triggerCallbacks(eventName, args);
    return this;
  }

  resolveWaiters(eventName, args) {
    if (this.waitPromises[eventName]) {
      this.waitPromises[eventName].forEach((promise) => {
        promise.resolve.apply(this, args);
      });
      delete this.waitPromises[eventName]; // removing promises registry for resolved
    }
  }

  async syncTriggerCallback(eventName, args) {
    if (this.events[eventName]) {
      for (const callback of this.events[eventName]) {
        await callback.apply(this, args);
      }
    }
  }

  triggerCallbacks(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback.apply(this, args);
      });
    }
  }

  on(eventNames, callback) {
    if (!Array.isArray(eventNames)) {
      eventNames = [eventNames];
    }
    eventNames.forEach((eventName) => {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    });
    return this;
  }

  waitFor(eventName) {
    if (!this.waitPromises[eventName]) {
      this.waitPromises[eventName] = [];
    }
    return new Promise((resolve, reject) => {
      /* if (this.eventSeen.indexOf(eventName) >= 0) {
        resolve();
      } else {*/
      this.waitPromises[eventName].push({resolve, reject});
      /* }*/
    });
  }

  destroy() {
    for (const event in this.events) {
      delete this.events[event];
    }
  }
}

export class AsyncEventObservable extends EngineObservable {
  // @ts-ignore
  async emit(eventName, ...args) {
    this.visitEvent(eventName);
    this.resolveWaiters(eventName, args);
    await this.triggerCallbacks(eventName, args);
    return this;
  }

  async triggerCallbacks(eventName, ...args) {
    if (this.events[eventName]) {
      await Promise.all(
        this.events[eventName].map(async (callback) => {
          try {
            await callback.apply(this, args);
          } catch (e) {
            console.error(e);
            throw e;
          }
        })
      );
    }
  }
}
