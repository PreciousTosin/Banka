class DeleteTableView extends TableView {
  constructor(model) {
    super(model);
    this.model = model;
    this.deleteAccountEvent = new Event(this);
    this.modifyAccountEvent = new Event(this);
    this.init(this.model.tableType);
  }

  init(tableType) {
    this.createChildren()
      .createDefaultTable(tableType)
      .createTableChildren()
      .setupHandlers(tableType)
      .enable(tableType);
  }

  createChildren() {
    this.tableContainer = document.querySelector('.gen--table');
    this.adminBody = document.querySelector('.admin--body');
    return this;
  }

  createDefaultTable() {
    this.createTableToDeleteAccounts();
    return this;
  }

  createTableChildren() {
    this.table = document.querySelector('#recordsTable');
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    console.log('TABLE BODY: ', this.tableBody);
    return this;
  }

  setupHandlers() {
    this.deleteAccountButtonHandler = this.deleteAccountButton.bind(this);
    /**
    Handlers from Event Dispatcher
    */
    this.loadTableHandler = this.loadTable.bind(this);
    this.removeTableRowHandler = this.removeTableRow.bind(this);
    return this;
  }

  enable() {
    /**
     * Set up event for click handlers
     * */
    this.tableBody
      .forEach(item => item.addEventListener('click', this.deleteAccountButtonHandler));

    /**
     * Event Dispatcher for models
    */
    this.model.loadTableEvent.attach(this.loadTableHandler);
    this.model.deleteAccountEvent.attach(this.removeTableRowHandler);
  }

  // notify model of delete operation
  deleteAccountButton(sender) {
    const rowData = this.getTableRow(sender);
    this.deleteAccountEvent.notify(rowData);
  }

  display(panel) {
    this.buildTable(panel);
  }

  buildTable(panel) {
    console.log('TABLE TO BE CREATED: ', panel);
    this.createTableToDeleteAccounts();
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    this.deleteAccountButtonHandler = this.deleteAccountButton.bind(this);
    this.tableBody
      .forEach(item => item.addEventListener('click', this.deleteAccountButtonHandler));
  }

  createDomTable(tableContainer) {
    TableView.removeNode(this.adminBody);
    this.adminBody.appendChild(tableContainer);
  }

  /* deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
  } */

  createTableToDeleteAccounts() {
    const btnClass = 'delete--btn btn btn--danger';
    const btnText = 'Delete';
    const btn = TableView.createRowButton(btnClass, btnText);
    const data = this.model.tableData;
    const header = this.model.tableHeader;
    const config = {
      columns: [
        null, null, null, null, null, null, null, { 
          name: 'Delete',
          content: btn,
         }
      ],
      buttons: 1,
      header,
      data, 
      hide: [0, 2, 3]
    };
    const table = this.createTable(config);
    this.createDomTable(table);
  }

  /* -------------------- Handlers From Event Dispatcher from Model ----------------- */

  loadTable(sender, table) {
    console.log('RELOADING TABLE: ', table);
    this.display(table);
  }

  removeTableRow (sender, payload) {
    console.log('MODEL PAYLOAD: ', payload, payload.row);
    // remove row from table;
    if (Number(payload.row) !== 0) {
      document.querySelector('#recordsTable').deleteRow(payload.row);
      return;
    }
    return;
  }

  /* -------------------- End Handlers From Event Dispatcher from Model ----------------- */
}