import { TenantService } from '@/modules/engine/services/tenant.service';

export class EngineFlowNode {
  label
  name
  icon

  constructor(props = {}) {
    Object.assign(this, props);
  }

  static async fetchAllFolders() {
    const response = await TenantService.request(
      Object.assign({
        url: '/api/flow/nodes',
        queryMethod: 'get',
      })
    );
    return response.contents;
  }
}
