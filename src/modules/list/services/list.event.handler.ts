export class ListEventHandler {
  vm

  constructor(vm) {
    this.vm = vm;
  }

  selectionChangeHandler(e) {
    const engineList = this.vm.engineList;
    engineList.selectionChange(e);
  }

  handleCurrentChange() {}

  sortHandler(e) {
    const engineList = this.vm.engineList;
    engineList.order = {
      direction: e.order === 'ascending' ? 'ASC' : 'DESC',
      attribute: e.prop,
    };
    return engineList.refresh();
  }
}
