class TableController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    this.setupHandlers()
      .enable();
  }

  setupHandlers() {
    // this.loadTableHandler = this.loadTable.bind(this);
    return this;
  }

  enable() {
    return this;
  }

  changeTable(table) {
    console.log('CHANGING TABLE: ', table);
    this.loadTable(table);
  }

  /* loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  } */
}