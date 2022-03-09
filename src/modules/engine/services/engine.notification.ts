import {ElMessageBox, ElMessage} from 'element-plus';

export class EngineNotification {
  static defaultMessageConfig = {
    showClose: true,
    type: 'success',
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  }
  /** @type instance NavigationService*/
  static instance = new EngineNotification()

  /** @return EngineNotification*/
  static getInstance() {
    return EngineNotification.instance;
  }

  async showMessage(settings = {}) {
    settings = Object.assign(
      {},
      EngineNotification.defaultMessageConfig,
      settings
    );
    await ElMessage(settings);
  }

  async showElMessageBox(settings = {}) {
    settings = Object.assign(
      {},
      EngineNotification.defaultMessageConfig,
      settings
    );
    await ElMessageBox(settings);
  }

  async showAlert(message, title, settings = {}) {
    settings = Object.assign(
      {},
      EngineNotification.defaultMessageConfig,
      settings
    );
    return ElMessageBox.alert(message, title, settings);
  }

  async showConfirm(message, title, settings = {}) {
    settings = Object.assign(
      {},
      EngineNotification.defaultMessageConfig,
      settings
    );
    return ElMessageBox.confirm(message, title, settings);
  }

  async showPrompt(message, title, settings = {}) {
    settings = Object.assign(
      {},
      EngineNotification.defaultMessageConfig,
      settings
    );
    return ElMessageBox.prompt(message, title, settings);
  }
}
