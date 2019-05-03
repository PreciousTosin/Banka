class ManageUserTableController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.modal = '';
    this.createModal = '';
    this.init();
  }

  init() {
    this.setupHandlers()
      .enable();
  }

  setupHandlers() {
    // this.loadTableHandler = this.loadTable.bind(this);
    this.modifyHandler = this.modifyUser.bind(this);
    this.createUserHandler = this.createUser.bind(this);
    return this;
  }

  enable() {
    this.view.modifyUserEvent.attach(this.modifyHandler);
    this.view.addUserEvent.attach(this.createUserHandler);
    return this;
  }

  loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  }

  modifyUser(sender, payload) {
    console.log('MODIFY TABLE CONTROLLER: ', payload);
    this.modal = new ModifyModal(); // create new modal instance
    this.modal.toggleModal(); // toggle modal visibility
    this.model.modifyUser(payload);
  }

  createUser(sender, payload) {
    // console.log('TABLE CONTROLLER: ', payload);
    this.createModal = new ManageUserModal(); // create new modal instance
    this.createModal.toggleModal(); // toggle modal visibility
    this.model.createUser(payload);
  }
}