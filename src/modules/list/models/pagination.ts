import { EngineObservable } from '@/modules/engine/core/engine.observable';

export class Pagination extends EngineObservable {
  static events = {
    sizeChange: 'sizeChange',
    currentChange: 'currentChange',
  }
  // page number
  page = 0
  // Number of rows per page
  limit = 15
  // Total number of rows
  total = 0
  pageSizes = [15, 30, 46, 60, 100]

  constructor(config = {}) {
    super();
    Object.assign(this, config);
  }

  setConfig(config = {}) {
    Object.assign(this, config);
  }

  sizeChange() {
    this.emit(Pagination.events.sizeChange);
  }

  currentChange() {
    this.emit(Pagination.events.currentChange);
  }
}
