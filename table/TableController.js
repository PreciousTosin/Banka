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
    this.deleteHandler = this.deleteAccount.bind(this);
    this.modifyHandler = this.modifyAccount.bind(this);
    return this;
  }

  enable() {
    this.view.deleteAccountEvent.attach(this.deleteHandler);
    this.view.modifyAccountEvent.attach(this.modifyHandler);
    return this;
  }

  changeTable(table) {
    console.log('CHANGING TABLE: ', table);
    this.loadTable(table);
  }

  loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  }

  deleteAccount(sender, payload) {
    console.log('TABLE CONTROLLER: ', payload);
    this.model.deleteAccount(payload);
  }

  modifyAccount(sender, payload) {
    console.log('MODIFY TABLE CONTROLLER: ', payload);
    this.model.modifyAccount(payload);
  }
};