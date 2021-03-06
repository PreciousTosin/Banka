class ChargeTableController {
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
    this.chargeHandler = this.chargeAccount.bind(this);
    return this;
  }

  enable() {
    this.view.chargeAccountEvent.attach(this.chargeHandler);
    return this;
  }


  loadTable(table) {
    console.log('LOADING TABLE: ', table);
    this.model.loadTable(table);
  }


  chargeAccount(sender, tableData) {
    console.log('CHARGE TABLE CONTROLLER: ', tableData);
    const chargeFunc = (body) => this.model.chargeAccount(tableData, body);
    this.modal = new ChargeModal(chargeFunc);
    this.modal.toggleModal();
    // this.model.chargeAccount(payload);
  }
}