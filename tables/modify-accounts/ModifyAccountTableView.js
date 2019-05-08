class ModifyTableView extends TableView {
  constructor(model) {
    super(model);
    this.model = model;
    this.modifyAccountEvent = new Event(this);
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
    this.createTableToActivateAccounts();
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
    this.modifyAccountButtonHandler = this.modifyAccountButton.bind(this);
    /**
    Handlers from Event Dispatcher
    */
    this.loadTableHandler = this.loadTable.bind(this);
    this.toggleSpinnerHandler = this.toggleSpinnerFromModal.bind(this);
    return this;
  }

  enable() {
    // add event listener for modify button in table row
    this.enableModifyBtn();
    /**
     * Event Dispatcher for models
    */
    this.model.loadTableEvent.attach(this.loadTableHandler);
    // this.model.deleteAccountEvent.attach(this.refreshHandler);
    this.model.modifyAccountEvent.attach(this.loadTableHandler);
    this.model.toggleSpinnerEvent.attach(this.toggleSpinnerHandler);
    return this;
  }

  enableModifyBtn() {
    this.tableBody
      .forEach(item => item.addEventListener('click', this.modifyAccountButtonHandler));
  }

  modifyAccountButton(sender) {
    const rowData = this.getTableRow(sender);
    this.modifyAccountEvent.notify(rowData);
  }

  display(panel) {
    this.buildTable(panel);
  }

  buildTable(panel) {
    console.log('MODIFY ACCOUNT TABLE TO BE CREATED: ');
    this.createTableToActivateAccounts();
    this.table = document.querySelector('#recordsTable');
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    this.modifyAccountButtonHandler = this.modifyAccountButton.bind(this);
    this.tableBody
      .forEach(item => item.addEventListener('click', this.modifyAccountButtonHandler));
  }


  createDomTable(tableContainer) {
    TableView.removeNode(this.adminBody);
    this.adminBody.appendChild(tableContainer);
  }


  createTableToActivateAccounts() {
    const btnClass = 'modify--btn btn btn--success';
    const btnText = 'Modify';
    const btn = TableView.createRowButton(btnClass, btnText);
    const header = this.model.tableHeader;
    const data = this.model.tableData;
    const config = {
      columns: [
        null, null, null, null, null, null, null, { 
          name: 'Change Status',
          content: btn,
         }
      ],
      buttons: 1,
      header,
      data,
      hide: [0, 1, 3],
    };
    const table = this.createTable(config);
    this.createDomTable(table);
    
  }

  /* -------------------- Handlers From Event Dispatcher ----------------- */

  loadTable(sender, table) {
    console.log('RELOADING MODIFY TABLE');
    this.display(table);
  }

  toggleSpinnerFromModal() {
    console.log('TOGGLE NOTIFIED');
    TableView.toggleSpinner();
  }

  /* -------------------- End Handlers From Event Dispatcher ----------------- */
}