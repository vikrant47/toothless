import * as _ from 'lodash';

export class Utils {
  /**
   * @callback Utils#OptionsIteratee
   * @param {string} key
   * @param {string} value
   * @param {string} [optgroup]
   */

  /**
   * Iterates over radio/checkbox/selection options, it accept four formats
   *
   * @example
   * // array of values
   * options = ['one', 'two', 'three']
   * @example
   * // simple key-value map
   * options = {1: 'one', 2: 'two', 3: 'three'}
   * @example
   * // array of 1-element maps
   * options = [{1: 'one'}, {2: 'two'}, {3: 'three'}]
   * @example
   * // array of elements
   * options = [{value: 1, label: 'one', optgroup: 'group'}, {value: 2, label: 'two'}]
   *
   * @param {object|array} options
   * @param {Utils#OptionsIteratee} tpl
   */
  static iterateOptions(options, tpl) {
    if (options) {
      if (Array.isArray(options)) {
        options.forEach(function (entry) {
          if (_.isObject(entry)) {
            // array of elements
            if ('value' in entry) {
              tpl(entry.value, entry.label || entry.value, entry.optgroup);
              // eslint-disable-next-line brace-style
            }
            // array of one-element maps
            else {
              _.each(entry, function (key, val) {
                tpl(key, val);
                return false; // break after first entry
              });
            }
          }
          // array of values
          else {
            tpl(entry, entry);
          }
        });
      }
      // unordered map
      else {
        _.each(options, function (key, val) {
          tpl(key, val);
        });
      }
    }
  }

  /**
   * Replaces {0}, {1}, ... in a string
   * @param {string} str
   * @param {...*} args
   * @returns {string}
   */
  static fmt(str, args) {
    if (!Array.isArray(args)) {
      // eslint-disable-next-line prefer-rest-params
      args = Array.prototype.slice.call(arguments, 1);
    }

    return str.replace(/{([0-9]+)}/g, function (m, i) {
      return args[parseInt(i)];
    });
  }

  /**
   * Throws an Error object with custom name or logs an error
   * @param {boolean} [doThrow=true]
   * @param {string} type
   * @param {string} message
   * @param {...*} args
   */
  static error(...argm) {
    let i = 0;
    const doThrow = typeof arguments[i] === 'boolean' ? arguments[i++] : true;

    const type = arguments[i++];
    const message = arguments[i++];
    const args = Array.isArray(arguments[i])
      ? arguments[i]
      : Array.prototype.slice.call(arguments, i);

    if (doThrow) {
      const err = new Error(Utils.fmt(message, args));
      err.name = type + 'Error';
      err['args'] = args;
      throw err;
    } else {
      console.error(type + 'Error: ' + Utils.fmt(message, args));
    }
  }

  /**
   * Changes the type of a value to int, float or bool
   * @param {*} value
   * @param {string} type - 'integer', 'double', 'boolean' or anything else (passthrough)
   * @returns {*}
   */
  static changeType(value, type) {
    if (value === '' || value === undefined) {
      return undefined;
    }

    switch (type) {
      // @formatter:off
      case 'integer':
        if (typeof value === 'string' && !/^-?\d+$/.test(value)) {
          return value;
        }
        return parseInt(value);
      case 'double':
        if (typeof value === 'string' && !/^-?\d+\.?\d*$/.test(value)) {
          return value;
        }
        return parseFloat(value);
      case 'boolean':
        if (
          typeof value === 'string' &&
          !/^(0|1|true|false){1}$/i.test(value)
        ) {
          return value;
        }
        return (
          value === true ||
          value === 1 ||
          value.toLowerCase() === 'true' ||
          value === '1'
        );
      default:
        return value;
      // @formatter:on
    }
  }

  /**
   * Escapes a string like PHP's mysql_real_escape_string does
   * @param {string} value
   * @returns {string}
   */
  static escapeString(value) {
    if (typeof value !== 'string') {
      return value;
    }

    return (
      value
        .replace(/[\0\n\r\b\\\'\"]/g, function (s) {
          switch (s) {
            // @formatter:off
            case '\0':
              return '\\0';
            case '\n':
              return '\\n';
            case '\r':
              return '\\r';
            case '\b':
              return '\\b';
            default:
              return '\\' + s;
            // @formatter:off
          }
        })
        // uglify compliant
        .replace(/\t/g, '\\t')
        .replace(/\x1a/g, '\\Z')
    );
  }

  /**
   * Escapes a string for use in regex
   * @param {string} str
   * @returns {string}
   */
  static escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  /**
   * Escapes a string for use in HTML element id
   * @param {string} str
   * @returns {string}
   */
  static escapeElementId(str) {
    // Regex based on that suggested by:
    // https://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
    // - escapes : . [ ] ,
    // - avoids escaping already escaped values
    return str
      ? str.replace(/(\\)?([:.\[\],])/g, function ($0, $1, $2) {
        return $1 ? $0 : '\\' + $2;
      })
      : str;
  }

  /**
   * Sorts objects by grouping them by `key`, preserving initial order when possible
   * @param {object[]} items
   * @param {string} key
   * @returns {object[]}
   */
  static groupSort(items, key) {
    const optgroups: any[] = [];
    const newItems: any[] = [];

    items.forEach(function (item: any) {
      let idx;

      if (item[key]) {
        idx = optgroups.lastIndexOf(item[key]);

        if (idx === -1) {
          idx = optgroups.length;
        } else {
          idx++;
        }
      } else {
        idx = optgroups.length;
      }

      optgroups.splice(idx, 0, item[key]);
      newItems.splice(idx, 0, item);
    });

    return newItems;
  }

  /**
   * Defines properties on an Node prototype with getter and setter.<br>
   *     Update events are emitted in the setter through root Model (if any).<br>
   *     The object must have a `__` object, non enumerable property to store values.
   * @param {function} obj
   * @param {string[]} fields
   */
  static defineModelProperties(obj, fields) {
    fields.forEach(function (field) {
      Object.defineProperty(obj.prototype, field, {
        enumerable: true,
        get: function () {
          return this.__[field];
        },
        set: function (value) {
          const previousValue =
            this.__[field] !== null && typeof this.__[field] === 'object'
              ? Object.assign({}, this.__[field])
              : this.__[field];

          this.__[field] = value;

          if (this.model !== null) {
            /**
             * After a value of the model changed
             * @event model:update
             * @memberof Model
             * @param {Node} node
             * @param {string} field
             * @param {*} value
             * @param {*} previousValue
             */
            this.model.trigger('update', this, field, value, previousValue);
          }
        },
      });
    });
  }
}

export class MongoParser {
  filters = []
  settings = {
    default_condition: 'AND',
    mongoOperators: {
      // @formatter:off
      equal(v) {
        return v[0];
      },
      not_equal(v) {
        return {$ne: v[0]};
      },
      in(v) {
        return {$in: v};
      },
      not_in(v) {
        return {$nin: v};
      },
      less(v) {
        return {$lt: v[0]};
      },
      less_or_equal(v) {
        return {$lte: v[0]};
      },
      greater(v) {
        return {$gt: v[0]};
      },
      greater_or_equal(v) {
        return {$gte: v[0]};
      },
      between(v) {
        return {$gte: v[0], $lte: v[1]};
      },
      not_between(v) {
        return {$lt: v[0], $gt: v[1]};
      },
      begins_with(v) {
        return {$regex: '^' + Utils.escapeRegExp(v[0])};
      },
      not_begins_with(v) {
        return {$regex: '^(?!' + Utils.escapeRegExp(v[0]) + ')'};
      },
      contains(v) {
        return {$regex: Utils.escapeRegExp(v[0])};
      },
      not_contains(v) {
        return {
          $regex: '^((?!' + Utils.escapeRegExp(v[0]) + ').)*$',
          $options: 's',
        };
      },
      ends_with(v) {
        return {$regex: Utils.escapeRegExp(v[0]) + '$'};
      },
      not_ends_with(v) {
        return {$regex: '(?<!' + Utils.escapeRegExp(v[0]) + ')$'};
      },
      is_empty(v) {
        return '';
      },
      is_not_empty(v) {
        return {$ne: ''};
      },
      is_null(v) {
        return null;
      },
      is_not_null(v) {
        return {$ne: null};
      },
      // @formatter:on
    },

    mongoRuleOperators: {
      $eq(v) {
        return {
          val: v,
          op: v === null ? 'is_null' : v === '' ? 'is_empty' : 'equal',
        };
      },
      $ne(v) {
        v = v.$ne;
        return {
          val: v,
          op:
            v === null
              ? 'is_not_null'
              : v === ''
              ? 'is_not_empty'
              : 'not_equal',
        };
      },
      $regex(v) {
        v = v.$regex;
        if (v.slice(0, 4) === '^(?!' && v.slice(-1) === ')') {
          return {val: v.slice(4, -1), op: 'not_begins_with'};
        } else if (v.slice(0, 5) === '^((?!' && v.slice(-5) === ').)*$') {
          return {val: v.slice(5, -5), op: 'not_contains'};
        } else if (v.slice(0, 4) === '(?<!' && v.slice(-2) === ')$') {
          return {val: v.slice(4, -2), op: 'not_ends_with'};
        } else if (v.slice(-1) === '$') {
          return {val: v.slice(0, -1), op: 'ends_with'};
        } else if (v.slice(0, 1) === '^') {
          return {val: v.slice(1), op: 'begins_with'};
        } else {
          return {val: v, op: 'contains'};
        }
      },
      between(v) {
        return {val: [v.$gte, v.$lte], op: 'between'};
      },
      not_between(v) {
        return {val: [v.$lt, v.$gt], op: 'not_between'};
      },
      $in(v) {
        return {val: v.$in, op: 'in'};
      },
      $nin(v) {
        return {val: v.$nin, op: 'not_in'};
      },
      $lt(v) {
        return {val: v.$lt, op: 'less'};
      },
      $lte(v) {
        return {val: v.$lte, op: 'less_or_equal'};
      },
      $gt(v) {
        return {val: v.$gt, op: 'greater'};
      },
      $gte(v) {
        return {val: v.$gte, op: 'greater_or_equal'};
      },
    },
  }
  operators = {
    equal: {
      type: 'equal',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string', 'number', 'datetime', 'boolean'],
    },
    not_equal: {
      type: 'not_equal',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string', 'number', 'datetime', 'boolean'],
    },
    in: {
      type: 'in',
      nb_inputs: 1,
      multiple: true,
      apply_to: ['string', 'number', 'datetime'],
    },
    not_in: {
      type: 'not_in',
      nb_inputs: 1,
      multiple: true,
      apply_to: ['string', 'number', 'datetime'],
    },
    less: {
      type: 'less',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['number', 'datetime'],
    },
    less_or_equal: {
      type: 'less_or_equal',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['number', 'datetime'],
    },
    greater: {
      type: 'greater',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['number', 'datetime'],
    },
    greater_or_equal: {
      type: 'greater_or_equal',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['number', 'datetime'],
    },
    between: {
      type: 'between',
      nb_inputs: 2,
      multiple: false,
      apply_to: ['number', 'datetime'],
    },
    not_between: {
      type: 'not_between',
      nb_inputs: 2,
      multiple: false,
      apply_to: ['number', 'datetime'],
    },
    begins_with: {
      type: 'begins_with',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    not_begins_with: {
      type: 'not_begins_with',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    contains: {
      type: 'contains',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    not_contains: {
      type: 'not_contains',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    ends_with: {
      type: 'ends_with',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    not_ends_with: {
      type: 'not_ends_with',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    is_empty: {
      type: 'is_empty',
      nb_inputs: 0,
      multiple: false,
      apply_to: ['string'],
    },
    is_not_empty: {
      type: 'is_not_empty',
      nb_inputs: 0,
      multiple: false,
      apply_to: ['string'],
    },
    is_null: {
      type: 'is_null',
      nb_inputs: 0,
      multiple: false,
      apply_to: ['string', 'number', 'datetime', 'boolean'],
    },
    is_not_null: {
      type: 'is_not_null',
      nb_inputs: 0,
      multiple: false,
      apply_to: ['string', 'number', 'datetime', 'boolean'],
    },
  }

  /**
   * Triggers an event on the builder container and returns the modified value
   * @param {string} type
   * @param {*} value
   * @returns {*}
   */
  change(type, value, rule = null, ...args) {
    return value;
  }

  /**
   * Returns a particular operator by its type
   * @param {string} type
   * @param {boolean} [doThrow=true]
   * @returns {object|null}
   * @throws UndefinedOperatorError
   * @private
   */
  getOperatorByType(type, doThrow = true) {
    if (type === '-1') {
      return null;
    }
    for (let i in this.operators) {
      if (this.operators[i].type === type) {
        return this.operators[i];
      }
    }
    throw new Error('UndefinedOperator ,Undefined operator ' + type);
  }

  /**
   * Returns rules as a MongoDB condition
   * @param {object} [data] - current rules by default
   * @returns {object}
   * @fires module:plugins.MongoDbSupport.changer:getMongoDBField
   * @fires module:plugins.MongoDbSupport.changer:ruleToMongo
   * @fires module:plugins.MongoDbSupport.changer:groupToMongo
   * @throws UndefinedMongoConditionError, UndefinedMongoOperatorError
   */
  getMongo(group) {
    if (!group.condition) {
      group.condition = this.settings.default_condition;
    }
    if (['AND', 'OR'].indexOf(group.condition.toUpperCase()) === -1) {
      throw new Error(
        'UndefinedMongoCondition : Unable to build MongoDB condition with condition ' +
        group.condition
      );
    }

    if (!group.rules) {
      return {};
    }

    const parts: any[] = [];

    group.rules.forEach((rule) => {
      if (rule.rules && rule.rules.length > 0) {
        parts.push(this.getMongo(rule));
      } else {
        const mdb = this.settings.mongoOperators[rule.operator];
        const ope = this.getOperatorByType(rule.operator);

        if (mdb === undefined) {
          throw new Error(
            'UndefinedMongoOperator, Unknown MongoDB operation for operator' +
            rule.operator
          );
        }

        if (ope.nb_inputs !== 0) {
          if (!(rule.value instanceof Array)) {
            rule.value = [rule.value];
          }
        }

        /**
         * Modifies the MongoDB field used by a rule
         * @event changer:getMongoDBField
         * @memberof module:plugins.MongoDbSupport
         * @param {string} field
         * @param {Rule} rule
         * @returns {string}
         */
        const field = this.change('getMongoDBField', rule.field, rule);

        const ruleExpression = {};
        ruleExpression[field] = mdb.call(this, rule.value);

        /**
         * Modifies the MongoDB expression generated for a rul
         * @event changer:ruleToMongo
         * @memberof module:plugins.MongoDbSupport
         * @param {object} expression
         * @param {Rule} rule
         * @param {*} value
         * @param {function} valueWrapper - function that takes the value and adds the operator
         * @returns {object}
         */
        parts.push(
          this.change('ruleToMongo', ruleExpression, rule, rule.value, mdb)
        );
      }
    });

    const groupExpression = {};
    groupExpression['$' + group.condition.toLowerCase()] = parts;

    /**
     * Modifies the MongoDB expression generated for a group
     * @event changer:groupToMongo
     * @memberof module:plugins.MongoDbSupport
     * @param {object} expression
     * @param {Group} group
     * @returns {object}
     */
    return this.change('groupToMongo', groupExpression, group);
  }

  /**
   * Converts a MongoDB condition to rules
   * @param {object} query
   * @returns {object}
   * @fires module:plugins.MongoDbSupport.changer:parseMongoNode
   * @fires module:plugins.MongoDbSupport.changer:getMongoDBFieldID
   * @fires module:plugins.MongoDbSupport.changer:mongoToRule
   * @fires module:plugins.MongoDbSupport.changer:mongoToGroup
   * @throws MongoParseError, UndefinedMongoConditionError, UndefinedMongoOperatorError
   */
  getRulesFromMongo(query) {
    if (query === undefined || query === null) {
      return null;
    }

    /**
     * Custom parsing of a MongoDB expression, you can return a sub-part of the expression, or a well formed group or rule JSON
     * @event changer:parseMongoNode
     * @memberof module:plugins.MongoDbSupport
     * @param {object} expression
     * @returns {object} expression, rule or group
     */
    query = this.change('parseMongoNode', query);

    // a plugin returned a group
    if ('rules' in query && 'condition' in query) {
      return query;
    }

    // a plugin returned a rule
    if ('id' in query && 'operator' in query && 'value' in query) {
      return {
        condition: this.settings.default_condition,
        rules: [query],
      };
    }

    const key = this.getMongoCondition(query);
    if (!key) {
      Utils.error('MongoParse', 'Invalid MongoDB condition format');
    }
    const _this = this;
    return (function parse(data: any, topKey: string) {
      const rules = data[topKey];
      const parts: any[] = [];

      rules.forEach(function (data) {
        // allow plugins to manually parse or handle special cases
        data = _this.change('parseMongoNode', data);

        // a plugin returned a group
        if ('rules' in data && 'condition' in data) {
          parts.push(data);
          return;
        }

        // a plugin returned a rule
        if ('id' in data && 'operator' in data && 'value' in data) {
          parts.push(data);
          return;
        }

        const key = _this.getMongoCondition(data);
        if (key) {
          parts.push(parse(data, key));
        } else {
          const field = Object.keys(data)[0];
          const value = data[field];

          const operator: string = _this.getMongoOperator(value);
          if (operator === undefined) {
            Utils.error('MongoParse', 'Invalid MongoDB condition format');
          }

          const mdbrl = _this.settings.mongoRuleOperators[operator];
          if (mdbrl === undefined) {
            Utils.error(
              'UndefinedMongoOperator',
              'JSON Rule operation unknown for operator "{0}"',
              operator
            );
          }

          // @ts-ignore
          const opVal = mdbrl.call(this, value);

          const id = _this.getMongoDBFieldID(field, value);

          /**
           * Modifies the rule generated from the MongoDB expression
           * @event changer:mongoToRule
           * @memberof module:plugins.MongoDbSupport
           * @param {object} rule
           * @param {object} expression
           * @returns {object}
           */
          const rule = _this.change(
            'mongoToRule',
            {
              id: id,
              field: field,
              operator: opVal.op,
              value: opVal.val,
            },
            data
          );

          parts.push(rule);
        }
      });

      /**
       * Modifies the group generated from the MongoDB expression
       * @event changer:mongoToGroup
       * @memberof module:plugins.MongoDbSupport
       * @param {object} group
       * @param {object} expression
       * @returns {object}
       */
      return _this.change(
        'mongoToGroup',
        {
          condition: topKey.replace('$', '').toUpperCase(),
          rules: parts,
        },
        data
      );
    })(query, key);
  }

  /**
   * Sets rules a from MongoDB condition
   * @see module:plugins.MongoDbSupport.getRulesFromMongo
   */
  setRulesFromMongo(query) {
    // @ts-ignore
    this.setRules(this.getRulesFromMongo(query));
  }

  /**
   * Returns a filter identifier from the MongoDB field.
   * Automatically use the only one filter with a matching field, fires a changer otherwise.
   * @param {string} field
   * @param {*} value
   * @fires module:plugins.MongoDbSupport:changer:getMongoDBFieldID
   * @returns {string}
   * @private
   */
  getMongoDBFieldID(field, value) {
    const matchingFilters: any[] = this.filters.filter(function (filter: any) {
      return filter.field === field;
    });

    let id;
    if (matchingFilters.length === 1) {
      id = matchingFilters[0].id;
    } else {
      /**
       * Returns a filter identifier from the MongoDB field
       * @event changer:getMongoDBFieldID
       * @memberof module:plugins.MongoDbSupport
       * @param {string} field
       * @param {*} value
       * @returns {string}
       */
      id = this.change('getMongoDBFieldID', field, value);
    }

    return id;
  }

  /**
   * Finds which operator is used in a MongoDB sub-object
   * @param {*} data
   * @returns {string|undefined}
   * @private
   */
  getMongoOperator(data): string {
    if (data !== null && typeof data === 'object') {
      if (data.$gte !== undefined && data.$lte !== undefined) {
        return 'between';
      }
      if (data.$lt !== undefined && data.$gt !== undefined) {
        return 'not_between';
      }

      const knownKeys = Object.keys(data).filter(
        function (key) {
          //@ts-ignore
          return !!this.settings.mongoRuleOperators[key];
        }.bind(this)
      );

      if (knownKeys.length === 1) {
        return knownKeys[0];
      }
    } else {
      return '$eq';
    }
    return 'none';
  }

  /**
   * Returns the key corresponding to "$or" or "$and"
   * @param {object} data
   * @returns {string|undefined}
   * @private
   */
  getMongoCondition(data): string {
    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === '$or' || keys[i].toLowerCase() === '$and') {
        return keys[i];
      }
    }
    return 'null';
  }
}
