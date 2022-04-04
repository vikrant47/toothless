import Layout from '@/layout/Layout.vue';
import ListView from '@/modules/list/views/index.vue';
import DashboardView from '@/components/ElSvgIcon.vue';
import request from '@/utils/axiosReq';
import {TenantService} from '@/modules/engine/services/tenant.service';
import $router from '@/router';
import {Engine} from '@/modules/engine/core/engine';
import {EngineAction} from '@/modules/engine/core/engine.action';

/*export const NavComponentMapping = {
  folder: Layout,
  list: ListView,
  // form: FormView,
  dashboard: DashboardView,
  /!* widget:,
  uipage:,
  iframe: Iframe*!/
};*/
export const NavRoutConfig = {
  folder: {
    path: '',
    component: Layout,
  },
  list: {
    path: '/models/:modelAlias/list/:listId/:view',
    component: ListView,
  },
  form: {
    path: '/models/:modelAlias/form/:formId/:recordId/:view',
    component: ListView,
  },
  dashboard: {
    path: '/dashboard/:dashboardId',
    component: DashboardView,
  },
  widget: {
    path: '/widget/:widgetId',
    component: DashboardView,
  },
};

export class NavigationService {
  /** @type instance NavigationService*/
  static instances = {
    topnav: new NavigationService('topnav'),
    sidebar: new NavigationService('sidebar'),
    applist: new NavigationService('applist'),
  }

  /** @return NavigationService*/
  static getInstance(position = 'sidebar'): NavigationService {
    return NavigationService.instances[position];
  }

  static allNavigations = []
  static navPromise
  navigations: any[] = []
  protected position: any;
  flatNavs: any[] = []

  constructor(position = 'sidebar') {
    this.position = position;
  }

  getMenusTree(pid) {
    return request({
      url: 'api/menus/lazy?pid=' + pid,
      method: 'get',
    });
  }

  async getNavigations() {
    if (this.navigations.length === 0) {
      const allNav = await NavigationService.getAllNavigations();
      this.navigations = NavigationService.navDataToRoute(
        allNav.filter((nav) => nav.position === this.position)
      );
    }
    return this.navigations;
  }

  static getAllNavigations(position?: string): Promise<any> {
    if (!this.navPromise) {
      this.navPromise = new Promise((resolve, reject) => {
        if (this.allNavigations.length === 0) {
          TenantService.instance
            .request({
              url: '/api/crm/navigations?position=' + position,
              method: 'get',
            })
            .then((navs) => {
              this.allNavigations = navs.contents;
              resolve(this.allNavigations);
            })
            .catch((err) => reject(err));
        } else {
          resolve(this.allNavigations);
        }
      });
    }
    return this.navPromise;
  }

  getFlatNavigations() {
    return new Promise((resolve, reject) => {
      if (this.flatNavs.length === 0) {
        this.getNavigations().then((navs) => {
          this.flatNavs = this.navDataToFlatArray(navs);
          resolve(this.flatNavs);
        });
      } else {
        resolve(this.flatNavs);
      }
    });
  }

  getNavigationSuperior(ids) {
    const data = ids.length || ids.length === 0 ? ids : Array.of(ids);
    return request({
      url: 'api/menus/superior',
      method: 'post',
      data,
    });
  }

  getChild(id) {
    return request({
      url: 'api/menus/child?id=' + id,
      method: 'get',
    });
  }

  add(data) {
    return request({
      url: 'api/menus',
      method: 'post',
      data,
    });
  }

  del(ids) {
    return request({
      url: 'api/menus',
      method: 'delete',
      data: ids,
    });
  }

  edit(data) {
    return request({
      url: 'api/menus',
      method: 'put',
      data,
    });
  }

  static getRouteConfig(nav) {
    const route = Object.assign(
      {component: Layout, path: nav.name},
      NavRoutConfig[nav.type]
    );
    route.meta = nav;
    route.name = nav.label; // setting name in route
    route.meta.title = nav.label;
    route.id = nav.id;
    if (nav.type === 'folder') {
      route.path = nav.name;
    }
    if (nav.type === 'list') {
      route.path = route.path
        .replace(':listId', nav.engine_list_id || 'default')
        .replace(':view', nav.view || 'details')
        .replace(':modelAlias', (nav.modelAlias || '').toLowerCase());
    } else if (nav.type === 'form') {
      route.path = route.path
        .replace(':formId', nav.engine_form_id || 'default')
        .replace(':recordId', nav.record_id || 'new')
        .replace(':view', nav.view || 'edit')
        .replace(':modelAlias', (nav.modelAlias || '').toLowerCase());
    } else if (nav.type === 'widget') {
      route.path = route.path.replace(':widgetId', nav.widget_id);
    } else if (nav.type === 'dashboard') {
      route.path = route.path.replace(':dashboardId', nav.dashboard_id);
    }
    return route;
  }

  navDataToFlatArray(navigation) {
    return navigation.reduce((result, nav) => {
      nav = Object.assign({}, nav); // cloning nav
      const children = nav.children;
      delete nav.children;
      result.push(nav);
      if (children && children.length > 0) {
        result = result.concat(this.navDataToFlatArray(children));
      }
      return result;
    }, []);
  }

  static navDataToRoute(navigation) {
    // Traverse the routing string from the background and convert it into a component object
    return navigation.map((nav) => {
      const route = this.getRouteConfig(nav);
      if (nav.children && nav.children.length) {
        route.children = this.navDataToRoute(nav.children);
      }
      return route;
    });
  }

  async executeNavigation(navigation) {
    const enAction = new EngineAction(navigation);
    await enAction.execute({navigation}, {});
  }

  /** Navigate to given url*/
  navigate(url) {
    return $router.push(url);
  }

  navigateToForm(
    modelAlias,
    formId = 'default',
    recordId = 'new',
    view = 'edit',
    params = {},
    newWindow = false
  ) {
    const url = '/models/' + modelAlias + '/form/' + formId + '/' + recordId + '/' + view + '?' + Engine.toUrlParam(params);
    if (newWindow) {
      return window.open(url);
    }
    return this.navigate(url);
  }

  navigateToList(
    modelAlias,
    listId = 'default',
    view = 'details',
    params = {},
    newWindow = false
  ) {
    const url = '/models/' + modelAlias + '/form/' + listId + '/' + view + '?' + Engine.toUrlParam(params);
    if (newWindow) {
      return window.open(url);
    }
    return this.navigate(url);
  }

  refresh() {
    $router.go(0);
  }
}
