import {TenantService} from '@/modules/engine/services/tenant.service';

export class ModelService {
  modelAlias
  protected tenantService: TenantService;

  constructor(modelName: string) {
    this.tenantService = TenantService.getInstance();
    this.modelAlias = modelName;
  }

  requestDefinition(options: any = {}) {
    return this.tenantService.request({
      url: '/api/crm/models/' + this.modelAlias + '/definition',
      params: {
        list: options.list,
        formId: options.formId,
      },
    });
  }

  paginate() {
  }
}
