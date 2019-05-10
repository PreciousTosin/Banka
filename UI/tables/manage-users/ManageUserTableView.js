class ManageUserTableView extends TableView {
  constructor(model) {
    super(model);
    this.model = model;
    this.modifyUserEvent = new Event(this);
    this.addUserEvent = new Event(this);
    this.init();
  }

  init(tableType) {
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
    this.createTableToManageUsers();
    return this;
  }

  createTableChildren() {
    this.table = document.querySelector('#recordsTable');
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    this.createButton = document.querySelector('.create--btn');
    console.log('TABLE BODY: ', this.tableBody);
    return this;
  }

  setupHandlers() {
    this.modifyUserButtonHandler = this.modifyUserButton.bind(this);
    this.createUserHandler = this.createUserButton.bind(this);
    /**
    Handlers from Event Dispatcher
    */
    this.loadTableHandler = this.loadTable.bind(this);
    this.addTableRowHandler = this.addTableRow.bind(this);
    this.toggleSpinnerHandler = this.toggleSpinnerFromModal.bind(this);
    return this;
  }

  enable() {
    /**
     * Set up event for click handlers
     * */
    this.createButton.addEventListener('click', this.createUserHandler, false);
    this.tableBody
      .forEach(item => item.addEventListener('click', this.modifyUserButtonHandler));

    /**
     * Event Dispatcher for models
    */
    this.model.loadTableEvent.attach(this.loadTableHandler);
    this.model.addUserEvent.attach(this.addTableRowHandler);
    this.model.toggleSpinnerEvent.attach(this.toggleSpinnerHandler);
  }

  // notify model of delete operation
  modifyUserButton(sender) {
    const rowData = this.getTableRow(sender);
    if (sender.target.type === 'button') {
      this.modifyUserEvent.notify(rowData);
    }
  }

  createUserButton(sender) {
    console.log('CREATING USERS: ');
    this.addUserEvent.notify();
  }

  display(panel) {
    this.buildTable(panel);
  }

  buildTable(panel) {
    console.log('TABLE TO BE CREATED: ', panel);
    this.createTableToManageUsers();
    this.table = document.querySelector('#recordsTable');
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    this.modifyUserButtonHandler = this.modifyUserButton.bind(this);
    document.querySelector('.create--btn').addEventListener('click', this.createUserHandler, false);
    this.tableBody
      .forEach(item => item.addEventListener('click', this.modifyUserButtonHandler));
  }

  createDomTable(tableContainer) {
    TableView.removeNode(this.adminBody);
    this.adminBody.appendChild(tableContainer);
  }

  /* deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
  } */

  createTableToManageUsers() {
    const btnClass = 'modify--btn btn btn--success';
    const btnText = 'Modify';
    const btn = TableView.createRowButton(btnClass, btnText);
    const data = this.model.tableData;
    const header = this.model.tableHeader;
    const config = {
      columns: [
        null, null, null, null, null, null, null, { 
          name: 'Modify',
          content: btn,
         }
      ],
      buttons: ['create'],
      header,
      data, 
      hide: [0]
    };
    const table = this.createTable(config);
    this.createDomTable(table);
  }

  /* -------------------- Handlers From Event Dispatcher from Model ----------------- */

  loadTable(sender, table) {
    console.log('RELOADING MANAGE USERS TABLE: ', table);
    this.display(table);
  }

  toggleSpinnerFromModal() {
    console.log('TOGGLE NOTIFIED');
    TableView.toggleSpinner();
  }

  addTableRow (sender, payload) {
    console.log('MODEL PAYLOAD: ', payload, payload.row);
    // remove row from table;
    /* if (Number(payload.row) !== 0) {
      document.querySelector('#recordsTable').deleteRow(payload.row);
      return;
    } */
    return;
  }

  /* -------------------- End Handlers From Event Dispatcher from Model ----------------- */
}