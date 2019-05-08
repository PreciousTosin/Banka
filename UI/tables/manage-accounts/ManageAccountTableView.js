class ManageTableView extends TableView {
  constructor(model) {
    super(model);
    this.model = model;
    this.deleteAccountEvent = new Event(this);
    this.viewAccountEvent = new Event(this);
    this.init();
  }

  init() {
    this.createChildren()
      .createDefaultTable()
      .createTableChildren()
      .setupHandlers()
      .enable();
    this.model.getTableData();
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
    this.viewButton = document.querySelector('.view--btn');
    console.log('TABLE BODY: ', this.tableBody);
    return this;
  }

  setupHandlers() {
    this.deleteAccountButtonHandler = this.deleteAccountButton.bind(this);
    this.viewAccountHandler = this.viewAccountButton.bind(this);
    /**
    Handlers from Event Dispatcher
    */
    this.loadTableHandler = this.loadTable.bind(this);
    this.removeTableRowHandler = this.removeTableRow.bind(this);
    this.toggleSpinnerHandler = this.toggleSpinnerFromModal.bind(this);
    return this;
  }

  enable() {
    /**
     * Set up event for click handlers
     * */
    this.viewButton.addEventListener('click', this.viewAccountHandler, false);
    this.tableBody
      .forEach(item => item.addEventListener('click', this.deleteAccountButtonHandler));

    /**
     * Event Dispatcher for models
    */
    this.model.loadTableEvent.attach(this.loadTableHandler);
    this.model.deleteAccountEvent.attach(this.removeTableRowHandler);
    this.model.toggleSpinnerEvent.attach(this.toggleSpinnerHandler);
  }

  // notify model of delete operation
  deleteAccountButton(sender) {
    const rowData = this.getTableRow(sender);
    if (sender.target.type === 'button') {
      this.deleteAccountEvent.notify(rowData);
    }
  }

  viewAccountButton(sender) {
    if (this.highlighted === '') {
      window.alert('Select a Table Row');
      return;
    }
    const tr = this.table.rows[this.highlighted];
    const dataIndex = tr.getAttribute('index');
    this.viewAccountEvent.notify({ dataIndex });
    console.log('SELECTED TABLE ROW IS: ', tr.getAttribute('index'));
  }

  display() {
    this.buildTable();
  }

  buildTable() {
    console.log('MANAGE ACCOUNT TABLE TO BE CREATED');
    this.createTableToDeleteAccounts();
    this.table = document.querySelector('#recordsTable');
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    this.deleteAccountButtonHandler = this.deleteAccountButton.bind(this);
    this.viewAccountHandler = this.viewAccountButton.bind(this);
    document.querySelector('.view--btn').addEventListener('click', this.viewAccountHandler);
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
      buttons: ['view'],
      header,
      data, 
      hide: [0, 1, 3]
    };
    const table = this.createTable(config);
    this.createDomTable(table);
  }

  /* -------------------- Handlers From Event Dispatcher from Model ----------------- */

  loadTable(sender) {
    console.log('RELOADING MANAGE ACCOUNT TABLE');
    this.display();
  }

  toggleSpinnerFromModal() {
    console.log('TOGGLE NOTIFIED');
    TableView.toggleSpinner();
  }

  removeTableRow (sender, payload) {
    console.log('MODEL PAYLOAD: ', payload, payload.row);
    // remove row from table;
    // ManageTableView.toggleSpinner(); // stop spinner
    if (Number(payload.row) !== 0) {
      document.querySelector('#recordsTable').deleteRow(payload.row);
      return;
    }
    return;
  }

  /* -------------------- End Handlers From Event Dispatcher from Model ----------------- */
}