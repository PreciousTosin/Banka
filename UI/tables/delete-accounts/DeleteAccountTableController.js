class DeleteTableController {
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
    this.deleteHandler = this.deleteAccount.bind(this);
    return this;
  }

  enable() {
    this.view.deleteAccountEvent.attach(this.deleteHandler);
    return this;
  }

  loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  }

  deleteAccount(sender, payload) {
    // console.log('TABLE CONTROLLER: ', payload);
    this.model.deleteAccount(payload);
  }
}