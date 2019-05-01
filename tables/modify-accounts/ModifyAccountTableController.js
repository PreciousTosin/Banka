class ModifyTableController {
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
    this.modifyHandler = this.modifyAccount.bind(this);
    return this;
  }

  enable() {
    this.view.modifyAccountEvent.attach(this.modifyHandler);
    return this;
  }


  loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  }


  modifyAccount(sender, payload) {
    console.log('MODIFY TABLE CONTROLLER: ', payload);
    this.model.modifyAccount(payload);
  }
}