import {MongoParser} from '@/modules/engine/services/mongo.parser';
import {TenantService} from '@/modules/engine/services/tenant.service';
import * as _ from 'lodash';

export class RestQuery {
  static mongoParser = new MongoParser()

  static toQueryBuilderRules(query) {
    const clonedQuery = JSON.parse(JSON.stringify(query));
    let mongoQuery = clonedQuery.where;
    if (!_.isEmpty(mongoQuery)) {
      if (!mongoQuery.$and && !mongoQuery.$or) {
        const conditions: any[] = [];
        for (const key in mongoQuery) {
          conditions.push({[key]: mongoQuery[key]});
        }
        mongoQuery = {$and: conditions};
      }
      clonedQuery.where = this.mongoParser.getRulesFromMongo(mongoQuery);
    }
    if (clonedQuery.normalizedWhere) {
      if (!_.isEmpty(clonedQuery.where)) {
        clonedQuery.where.rules.push(clonedQuery.normalizedWhere);
      } else {
        clonedQuery.where = clonedQuery.normalizedWhere;
      }
      delete clonedQuery.normalizedWhere;
    }
    if (clonedQuery.include && clonedQuery.include.length > 0) {
      clonedQuery.include = clonedQuery.include.map((query) => {
        return this.toQueryBuilderRules(query);
      });
    }
    return clonedQuery;
  }

  /**
   * This will merge given condition array and return a single condition
   * Note: queries should be mongo condition
   * @return Object
   */
  static merge(queries) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    return queries.slice(1).reduce(function (query, next) {
      if (next.modelAlias !== query.modelAlias) {
        throw new Error(
          'Can not merge querries of different modelAliass "' +
          query.modelAlias +
          '" != "' +
          next.modelAlias +
          '"'
        );
      }
      /** initializing where*/
      let where = query.where;
      if (!where || Object.keys(where).length === 0) {
        where = {$and: []};
      } else if (!where.$and) {
        where = {$and: [where]};
      }
      query.where = where;
      /** merging include queries*/
      if (next.include) {
        if (!query.include) {
          query.include = [];
        }
        for (const include of next.include) {
          const index = query.include.findIndex(
            (qinclude) => qinclude.modelAlias === include.modelAlias
          );
          if (index > -1) {
            _this.merge([query.include[index], include]);
          } else {
            query.include.push(include);
          }
        }
        delete next.include;
      }
      if (next.where && Object.keys(where).length > 0) {
        query.where.$and.push(next.where);
      }
      return query;
    }, queries[0]);
  }


  constructor(protected modelAlias: string) {
  }

  count(query) {
    return this.execute({
      method: 'get',
      params: {
        query: query,
        queryMethod: 'count',
      },
    });
  }

  findOne(query) {
    return this.execute({
      method: 'get',
      params: {
        query: query,
        queryMethod: 'findOne',
      },
    });
  }

  findById(id, options = {}) {
    return this.execute({
      method: 'get',
      params: {
        query: Object.assign({}, options, {where: {id: id}}),
        queryMethod: 'findOne',
      },
    });
  }

  paginate(query) {
    return this.execute({
      method: 'get',
      params: {query: query, queryMethod: 'paginate'},
    });
  }

  findAll(query) {
    return this.execute({
      method: 'get',
      params: {query: query, queryMethod: 'findAll'},
    });
  }

  create(data) {
    return this.execute({
      method: 'post',
      data: {
        queryMethod: 'create',
        data: data,
      },
    });
  }

  update(data, query, ajaxOptions?) {
    return this.execute({
      method: 'put',
      data: {
        queryMethod: 'update',
        query: query,
        data: data,
      },
    });
  }

  delete(query, ajaxOptions) {
    return this.execute({
      method: 'delete',
      data: {
        queryMethod: 'delete',
        query: query,
      },
    });
  }

  execute(options) {
    const data = options.data || {};
    const params = options.params || {};
    if (options.method.toLowerCase() === 'get' && params.query) {
      params.query = RestQuery.toQueryBuilderRules(params.query);
    } else if (data.query) {
      data.query = RestQuery.toQueryBuilderRules(data.query);
    }
    data.modelAlias = this.modelAlias.replaceAll('.', '\\');
    return TenantService.request(
      Object.assign(
        {
          url: '/api/crm/models/' + this.modelAlias + '/query',
          queryMethod: options.method,
        },
        options
      )
    );
  }

  request(settings = {}) {
    // @ts-ignore
    // eslint-disable-next-line prefer-spread,prefer-rest-params
    return TenantService.request.apply(TenantService, arguments);
  }
}
