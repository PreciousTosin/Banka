class ChargeTableView extends TableView {
  constructor(model) {
    super(model);
    this.model = model;
    this.chargeAccountEvent = new Event(this);
    this.init();
  }

  init() {
    this.createChildren()
      .createDefaultTable()
      .createTableChildren()
      .setupHandlers()
      .enable();
  }

  createChildren() {
    this.tableContainer = document.querySelector('.gen--table');
    this.adminBody = document.querySelector('.staff--body');
    return this;
  }

  createDefaultTable() {
    this.createTableToChargeAccounts();
    return this;
  }

  createTableChildren() {
    this.table = document.querySelector('#recordsTable');
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    console.log('CHARGE TABLE BODY: ', this.tableBody);
    // this.btns = document.querySelectorAll('.modal--opener');
    return this;
  }

  setupHandlers() {
    this.chargeAccountButtonHandler = this.chargeAccountButton.bind(this);
    /**
    Handlers from Event Dispatcher
    */
    this.loadTableHandler = this.loadTable.bind(this);
    return this;
  }

  enable() {
    // add event listener for modify button in table row
    this.enableChargeBtn();
    /**
     * Event Dispatcher for models
    */
    this.model.loadTableEvent.attach(this.loadTableHandler);
    this.model.chargeAccountEvent.attach(this.loadTableHandler);
    return this;
  }

  enableChargeBtn() {
    this.tableBody
      .forEach(item => item.addEventListener('click', this.chargeAccountButtonHandler));
  }

  chargeAccountButton(sender) {
    const rowData = this.getTableRow(sender);
    this.chargeAccountEvent.notify(rowData);
  }

  display(panel) {
    this.buildTable(panel);
  }

  buildTable(panel) {
    console.log('CHARGE TABLE TO BE CREATED: ', panel);
    this.createTableToChargeAccounts();
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    this.chargeAccountButtonHandler = this.chargeAccountButton.bind(this);
    this.tableBody
      .forEach(item => item.addEventListener('click', this.chargeAccountButtonHandler));
  }


  createDomTable(tableContainer) {
    TableView.removeNode(this.adminBody);
    this.adminBody.appendChild(tableContainer);
  }


  createTableToChargeAccounts() {
    const btnClass = 'charge--btn btn btn--primary';
    const btnText = 'Charge';
    const btn = TableView.createRowButton(btnClass, btnText);
    const header = this.model.tableHeader;
    const data = this.model.tableData;
    const config = {
      columns: [
        null, null, null, null, null, null, null, { 
          name: 'Transaction',
          content: btn,
         }
      ],
      buttons: 1,
      header,
      data,
      hide: [0, 2, 3], 
    };
    const table = this.createTable(config);
    this.createDomTable(table);
    
  }

  /* -------------------- Handlers From Event Dispatcher ----------------- */

  loadTable(sender, table) {
    console.log('RELOADING TABLE: ', table);
    this.display(table);
  }

  /* -------------------- End Handlers From Event Dispatcher ----------------- */
}