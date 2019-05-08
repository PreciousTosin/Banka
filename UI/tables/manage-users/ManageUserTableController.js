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

  modifyUser(sender, tableData) {
    console.log('MODIFY TABLE CONTROLLER: ', tableData);
    const modifyFunc = (body) => this.model.modifyUser(tableData, body);
    this.modal = new ModifyUserModal(modifyFunc); // create new modal instance
    this.modal.toggleModal(); // toggle modal visibility
    // this.model.modifyUser(payload);
  }

  createUser(sender) {
    console.log('CREATE USER TABLE CONTROLLER');
    const createFunc = (body) => this.model.createUser(body);
    this.createModal = new CreateUserModal(createFunc); // create new modal instance
    this.createModal.toggleModal(); // toggle modal visibility
    // this.model.createUser(payload);
  }
}