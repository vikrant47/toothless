import {EngineObservable} from '@/modules/engine/core/engine.observable';
import {EngineAction} from '@/modules/engine/core/engine.action';
import {Engine} from '@/modules/engine/core/engine';

export class EnginePopup extends EngineObservable {
  static popups: any[] = [] // all the popups in the world
  static sizes = {
    mini: '30%',
    small: '50%',
    medium: '70%',
    large: '90%',
    huge: '100%',
  }
  static events = {
    show: 'show',
    hide: 'hide',
  }
  id = null
  _index = -1
  component = {type: null, props: null, instance: null}
  visible = true
  actions: EngineAction[] = []
  width = '60%'
  size = 'medium'
  showCancel = true
  destroyOnClose = false
  loading = false
  $refs: any;

  static destroy(popId) {
    const index = EnginePopup.findIndex(popId);
    EnginePopup.popups.splice(index, 1);
  }

  static findIndex(popId) {
    return EnginePopup.popups.findIndex((popup) => popup.id === popId);
  }

  static open(settings: any = {}) {
    if (settings.id) {
      const popup = EnginePopup.get(settings.id);
      if (popup) {
        popup.show();
        return popup;
      }
    }
    const popup = new EnginePopup(settings);
    EnginePopup.popups.push(popup);
    return popup;
  }

  static get(popId) {
    return EnginePopup.popups.find((popup) => popup.id === popId);
  }

  constructor(settings: any = {}) {
    super();
    if (settings.id) {
      const popup = EnginePopup.get(settings.id); // destroyying an existing component withs ame id
      if (popup) {
        throw new Error('A popup exists with same id' + settings.id);
      }
    }
    Object.assign(this, this.initSettings(settings));
    this.width = EnginePopup.sizes[this.size];
    if (!this.id) {
      this.id = Engine.generateUniqueString();
    }
    this.initActions();
    this.initComponent().then(() => {
      console.log('Popup initialized');
    });
  }

  showLoader() {
    this.loading = true;
    return this;
  }

  hideLoader() {
    this.loading = false;
    return this;
  }

  initActions() {
    if (this.showCancel) {
      this.actions.push(
        new EngineAction({
          label: 'Cancel',
          icon: 'elu-icon-close',
          compiled: true,
          script: () => {
            this.destroy();
          },
          sort_order: 10000,
        })
      );
    }
    this.sortActions();
  }

  initSettings(settings) {
    if (settings.actions) {
      settings.actions = settings.actions.map((action) => {
        if (!(action instanceof EngineAction)) {
          return new EngineAction(action);
        }
        return action;
      });
    }
    return settings;
  }

  static async getComponentLoader() {
    return (await import('./engine.component.loader')).EngineComponentLoader;
  }

  async initComponent() {
    if (typeof this.component.type === 'string') {
      const loader = await EnginePopup.getComponentLoader();
      this.component.type = loader.getComponent(this.component.type);
    }
  }

  sortActions() {
    this.actions = this.actions.sort((a1, a2) => a1.sort_order - a2.sort_order);
  }

  show() {
    if (!this.visible) {
      this.visible = true;
      this.emit(EnginePopup.events.show);
    }
  }

  hide() {
    if (this.visible) {
      this.visible = false;
      this.emit(EnginePopup.events.hide);
    }
  }

  destroy() {
    this.onClosed();
    if (!this.destroyOnClose) {
      EnginePopup.destroy(this.id);
    }
  }

  /** events*/
  mounted() {
    this.component.instance = this.$refs.componentInstance;
    this.emit('open');
    if (this.visible === true) {
      this.emit('show');
    }
  }

  onClosed() {
    this.emit('closed');
    if (this.destroyOnClose) {
      EnginePopup.destroy(this.id);
    }
  }
}
