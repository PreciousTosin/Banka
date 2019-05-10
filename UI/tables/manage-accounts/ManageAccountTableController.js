class ManageTableController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.modal = '';

    this.init();
  }

  init() {
    this.setupHandlers()
      .enable();
  }

  setupHandlers() {
    // this.loadTableHandler = this.loadTable.bind(this);
    this.deleteHandler = this.deleteAccount.bind(this);
    this.viewHandler = this.viewAccount.bind(this);
    return this;
  }

  enable() {
    this.view.deleteAccountEvent.attach(this.deleteHandler);
    this.view.viewAccountEvent.attach(this.viewHandler);
    return this;
  }

  loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  }

  deleteAccount(sender, payload) {
    const deleteFunc = () => this.model.deleteAccount(payload);
    this.modal = new ConfirmDeleteModal(deleteFunc);
    this.modal.toggleModal();
    console.log('DELETE TABLE CONTROLLER: ', payload);
  }

  viewAccount(sender, payload) {
    const account = this.model.tableData.filter((acc) => acc.id === Number(payload.dataIndex));
    console.log('TABLE CONTROLLER: ', payload, ...account);
    this.modal = new ViewAccountModal(...account);
    this.modal.toggleModal();
    // this.model.deleteAccount(payload);
  }
}