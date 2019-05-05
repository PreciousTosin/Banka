class TransactionTableController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    console.log('ABOUT TO INITIALISE MODAL');
    this.init();
    this.modal = '';
  }

  init() {
    this.setupHandlers()
      .enable();
  }

  setupHandlers() {
    // this.loadTableHandler = this.loadTable.bind(this);
    this.viewTransactionHandler = this.viewTransaction.bind(this);
    return this;
  }

  enable() {
    this.view.viewTransactionEvent.attach(this.viewTransactionHandler);
    return this;
  }


  loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  }


  viewTransaction(sender, payload) {
    console.log('TRANSACTION TABLE CONTROLLER: ', payload);
    this.modal = new TransactionModal(payload.data);
    this.modal.toggleModal();
    // this.model.viewTransaction(payload);
  }
}