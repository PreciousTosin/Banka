class ManageUserTableController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.modal = new ModifyModal();
    this.init();
  }

  init() {
    this.setupHandlers()
      .enable();
  }

  setupHandlers() {
    // this.loadTableHandler = this.loadTable.bind(this);
    this.modifyHandler = this.modifyUser.bind(this);
    return this;
  }

  enable() {
    this.view.modifyUserEvent.attach(this.modifyHandler);
    return this;
  }

  loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  }

  modifyUser(sender, payload) {
    console.log('MODIFY TABLE CONTROLLER: ', payload);
    this.modal.toggleModal();
    this.model.modifyUser(payload);
  }

  createUser(sender, payload) {
    // console.log('TABLE CONTROLLER: ', payload);
    this.model.createUser(payload);
  }
}