import * as _ from 'lodash';
import {v4 as uuidv4} from 'uuid';

export class Engine {
  /** Constants */
  static TRANSIENTS = ['transient', '__ob__', 'undefined']
  static NOTIFICATION_TYPE = {
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
    ERROR: 'error',
  }
  static DEFAULT_SETTINGS = {
    notification: {
      type: this.NOTIFICATION_TYPE.SUCCESS,
      duration: 2500,
    },
    dataToTree: {
      idField: 'id',
      parentField: 'parentId',
      comparator: null,
    },
  }

  static getMediaServerUrl(mediaFile?: string) {
    return (
      import.meta.env.VUE_APP_MEDIA_SERVER_URL + ((mediaFile && mediaFile) || '')
    );
  }

  static notify(vm, options) {
    vm.$notify(Object.assign({}, Engine.DEFAULT_SETTINGS.notification, options));
  }

  static uuid(): string {
    return uuidv4();
  }

  static generateUniqueString(prefix = 'ID_') {
    return _.uniqueId(prefix);
  }

  /**
   * This will convert given data to tree which parent child relationship
   * e.g. [{id:1,name:parent,parent_id:null},{name:child,parent_id:1}]  will be converted into
   * [{id:1,name:parent,parent_id:null,children:[{name:child,parent_id:1}]}]
   * @param {Object} data
   * @param {Object} options
   */
  static convertToTree(data: any[] = [], options = {}) {
    const settings = Object.assign(
      {},
      this.DEFAULT_SETTINGS.dataToTree,
      options
    );
    if (typeof settings.comparator === 'function') {
      data = data.sort(settings.comparator);
    }
    const dataById = _.keyBy(data, settings.idField);
    for (const record of data) {
      const parentId = record[settings.parentField];
      if (parentId) {
        const parent = dataById[parentId];
        if (typeof parent.children === 'undefined') {
          parent.children = [];
        }
        parent.children.push(record);
        record.child = true;
      }
    }
    return data.filter((record) => !record.child);
  }

  /**
   * @param {Object} object
   * @param {Object} options
   * @return {{current:Array,children:Object}}
   * */
  static parseTransients(object, options = {}) {
    let transients = this.TRANSIENTS;
    if (Array.isArray(object['transient'])) {
      transients = transients.concat(object['transient']);
    }
    if (Array.isArray(options['transient'])) {
      transients = transients.concat(options['transient']);
    }
    const current: any[] = [];
    const children = {};
    for (const transient of transients) {
      if (typeof transient === 'string') {
        current.push(transient);
      } else {
        Object.assign(children, transient);
      }
    }
    return {current, children};
  }

  static isTransientProp(parsedTransients, field) {
    for (const matcher of parsedTransients.current) {
      if (field.match(matcher)) {
        return true;
      }
    }
    return false;
  }

  /**
   * This will convert given object to a plain json object
   * @param {Object} object
   * @param {Object} options
   */
  static marshall(object, options = {}) {
    // null, undefined, non-object, function
    if (!object || typeof object !== 'object') {
      return object;
    }
    // DOM Node
    if (object.nodeType && 'cloneNode' in object) {
      return object.cloneNode(true);
    }
    if (object) {
      if (typeof object.marshall === 'function') {
        const marshalled = object.marshall(options); // must return an object otherwise return false if cant handled
        if (marshalled !== false) {
          return marshalled;
        }
      }
      if (Array.isArray(object)) {
        return object.map((entry) => this.marshall(entry, options));
      } else if (typeof object === 'object') {
        const marshalled = {};
        const parsedTransients = this.parseTransients(object, options);
        for (const key in object) {
          if (
            typeof object[key] !== undefined &&
            !this.isTransientProp(parsedTransients, key)
          ) {
            // console.log('marshaling children ', key, { transients: parsedTransients.children[key] });
            marshalled[key] = this.marshall(object[key], {
              transients: parsedTransients.children[key],
            });
          }
        }
        return marshalled;
      } else if (object instanceof Date) {
        return new Date(object.getTime());
      }
    }
    return object;
  }

  /** This will populate given pojo to given instance*/
  static unmarshall(object, instance: any = {}, options: any = {}) {
    // null, undefined, non-object, function
    if (!object || typeof object !== 'object') {
      return object;
    }
    // DOM Node
    if (object.nodeType && 'cloneNode' in object) {
      return object.cloneNode(true);
    }
    if (instance) {
      if (typeof instance.unmarshall === 'function') {
        const unmarshalled = instance.unmarshall(object);
        if (unmarshalled !== false) {
          // will be returned true if all handled by instance
          if (typeof instance.afterUnmarshall === 'function') {
            instance.afterUnmarshall();
          }
          return instance;
        }
      }
      if (Array.isArray(object)) {
        const unmarshalled: any[] = [];
        for (let i = 0; i < object.length; i++) {
          unmarshalled[i] = this.unmarshall(object[i], instance[i]);
        }
        return unmarshalled;
      } else if (typeof object === 'object') {
        const parsedTransients = this.parseTransients(instance, options);
        for (const key in object) {
          if (
            typeof object[key] !== 'undefined' &&
            !this.isTransientProp(parsedTransients, key)
          ) {
            instance[key] = Engine.unmarshall(
              object[key],
              instance[key],
              parsedTransients.children[key]
            );
          }
        }
        if (typeof instance.afterUnmarshall === 'function') {
          instance.afterUnmarshall();
        }
        return instance;
      }
      return object;
    }
    return JSON.parse(JSON.stringify(object));
  }

  static serialize(object) {
    return JSON.stringify(this.marshall(object));
  }

  static unserialize(instance, serialized) {
    return this.unmarshall(instance, JSON.parse(serialized));
  }

  /** Clone given object by stringify and parsing it back*/
  static clone(object, useMarshalling = false, target = {}) {
    if (useMarshalling === true) {
      const cloned = Object.assign(target, this.marshall(object));
      // console.log('cloned ', object, ' as ', cloned);
      return cloned;
    }
    return JSON.parse(JSON.stringify(object));
  }

  /** This will convert given object to a query param*/
  static toUrlParam(object = {}) {
    const str: string[] = [];
    for (const p in object) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(object[p]));
    }
    return str.join('&');
  }

  static generateUniqueHash(object) {
    if (
      object === null ||
      typeof object === 'undefined' ||
      typeof object === 'number' ||
      typeof object === 'boolean'
    ) {
      return object;
    }
    if (typeof object !== 'string') {
      return JSON.stringify(object);
    }
    return object;
  }

  /**
   * This will generate the hashcode for given object
   * Note: object should not be circular in nature
   * */
  static generateHash(object) {
    if (
      object === null ||
      typeof object === 'undefined' ||
      typeof object === 'number' ||
      typeof object === 'boolean'
    ) {
      return object;
    }
    if (typeof object !== 'string') {
      object = JSON.stringify(object);
    }
    let hash = 0;
    let chr;
    for (let i = 0; i < object.length; i++) {
      chr = object.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  static sleep(timeout = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  static isUUID(str) {
    return str.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  }
}

window['Engine'] = Engine;
