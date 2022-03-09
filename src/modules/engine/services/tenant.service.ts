import request from '@/utils/axiosReq';

export class TenantService {
  /** @type instance TenantService*/
  static instance = new TenantService()

  /** @return TenantService*/
  static getInstance(): TenantService {
    return TenantService.instance;
  }

  static request(options) {
    return this.instance.request(options);
  }

  tenant = {
    code: 'default',
  }

  getCurrentTenant() {
    if (!this.tenant) {
      // TODO: fetch tenant
    }
    return this.tenant;
  }

  getOrigin() {
    return window.location.origin;
  }

  getBaseUrl() {
    return window.location.origin + this.getBaseTenantUrl();
  }

  getBaseTenantUrl() {
    // const tenantCode = this.tenant.code;
    return ''; // '/tenant/' + tenantCode;
  }

  /** Make request to current tenant*/
  request(options) {
    options = Object.assign({}, options);
    if (!options.url.startsWith('/tenant')) {
      if (options.url.startsWith('/api')) {
        options.url = '/api' + this.getBaseTenantUrl() + options.url.substr(4);
      } else {
        options.url = this.getBaseTenantUrl() + options.url;
      }
    }
    return request(options);
  }
}
