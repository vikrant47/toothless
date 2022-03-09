export class Selection {
  selections = {}
  hashKey = 'id'
  allSelected = false
  unselected = {}

  constructor(selections = {}, hashKey = 'id') {
    this.selections = selections;
    this.hashKey = hashKey;
  }

  select(record) {
    if (!this.allSelected) {
      this.selections[record[this.hashKey]] = record;
    } else {
      delete this.unselected[record[this.hashKey]];
    }
  }

  unselect(record) {
    if (!this.allSelected) {
      delete this.selections[record[this.hashKey]];
    } else {
      this.unselected[record[this.hashKey]] = record;
    }
  }

  getSelected() {
    return this.selections;
  }

  getUnselected() {
    return this.unselected;
  }

  getSelectedAsArray() {
    return Object.values(this.selections);
  }

  getUnselectedAsArray() {
    return Object.values(this.unselected);
  }

  selectAll() {
    this.allSelected = true;
    this.unselected = {};
    this.selections = {};
  }

  isAllSelected() {
    return this.allSelected;
  }

  unselectAll() {
    this.allSelected = false;
    this.selections = {};
    this.unselected = {};
  }
}
