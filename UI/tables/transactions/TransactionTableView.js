class TransactionTableView extends TableView {
  constructor(model) {
    super(model);
    this.model = model;
    this.viewTransactionEvent = new Event(this);
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
    this.TxContainer = document.querySelector('.transaction--container');
    return this;
  }

  createDefaultTable() {
    this.createTableToViewTransactions();
    return this;
  }

  createTableChildren() {
    this.table = document.querySelector('#recordsTable');
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    console.log('TABLE BODY: ', this.tableBody);
    // this.btns = document.querySelectorAll('.modal--opener');
    return this;
  }

  setupHandlers() {
    this.viewTransactionButtonHandler = this.viewTransactionButton.bind(this);
    /**
    Handlers from Event Dispatcher
    */
    this.loadTableHandler = this.loadTable.bind(this);
    return this;
  }

  enable() {
    // add event listener for modify button in table row
    this.enableViewTransactionBtn();
    /**
     * Event Dispatcher for models
    */
    this.model.loadTableEvent.attach(this.loadTableHandler);
    // this.model.deleteAccountEvent.attach(this.refreshHandler);
    this.model.viewTransactionEvent.attach(this.loadTableHandler);
    return this;
  }

  enableViewTransactionBtn() {
    this.tableBody
      .forEach(item => item.addEventListener('click', this.viewTransactionButtonHandler));
  }

  viewTransactionButton(sender) {
    const rowData = this.getTableRow(sender);
    this.viewTransactionEvent.notify(rowData);
  }

  display(panel) {
    this.buildTable(panel);
  }

  buildTable(panel) {
    console.log('TABLE TO BE CREATED: ', panel);
    this.createTableToActivateAccounts();
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    this.viewTransactionButtonHandler = this.viewTransactionButton.bind(this);
    this.tableBody
      .forEach(item => item.addEventListener('click', this.viewTransactionButtonHandler));
  }


  createDomTable(tableContainer) {
    TableView.removeNode(this.TxContainer);
    this.TxContainer.appendChild(tableContainer);
  }


  createTableToViewTransactions() {
    const btnClass = 'view--btn btn btn--primary';
    const btnText = 'View';
    const btn = TableView.createRowButton(btnClass, btnText);
    const header = this.model.tableHeader;
    const data = this.model.tableData;
    const config = {
      columns: [
        null, null, null, null, null, null, null, null, {
          name: 'View',
          content: btn,
         }
      ],
      buttons: 1,
      header,
      data,
      hide: [0, 1],
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