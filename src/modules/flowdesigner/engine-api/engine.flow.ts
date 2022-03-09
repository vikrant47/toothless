import {RestQuery} from '@/modules/engine/services/rest.query';
import {FORM_EVENTS} from '@/modules/form/engine-api/form-events';
import {EngineObservable} from '@/modules/engine/core/engine.observable';

export class EngineFlow extends EngineObservable {
  id: string;
  settings: any = {
    flowId: 'new',
    showLoader: true,
  }
  record: any = {}
  protected loading = false;

  constructor(settings) {
    super();
    this.settings = Object.assign(this.settings, settings);
  }

  isNew() {
    return !this.settings.flowId || this.settings.flowId === 'new';
  }

  enableLoading() {
    if (this.settings.showLoader === true) {
      this.loading = true;
    }
    return this;
  }

  disableLoading() {
    this.loading = false;
    return this;
  }

  async refresh() {
    this.enableLoading();
    try {
      await this.syncEmit('beforeRefresh');
      const response = await new RestQuery(this.settings.modelAlias).findById(
        this.settings.flowId
      );
      this.record = response.contents;
    } catch (err) {
      this.disableLoading();
      this.emit(FORM_EVENTS.form.error, err);
      throw err;
    }
  }
}
