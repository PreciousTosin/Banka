class TableView {
  constructor(model) {
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

  createDefaultTable(tableType) {
    if (tableType === 'manage-accounts') {
      this.createTableToDeleteAccounts();
    } else {
      this.createTableToActivateAccounts();
    }
    return this;
  }

  createTableChildren() {
    this.table = document.querySelector('#recordsTable');
    this.tableBody = document.querySelectorAll('#recordsTable tbody');
    console.log('TABLE BODY: ', this.tableBody);
    return this;
  }

  setupHandlers(tableType) {
    if (tableType === 'manage-accounts') {
      this.deleteAccountButtonHandler = this.deleteAccountButton.bind(this);
    } else if (tableType === 'manage-users') {
      this.modifyAccountButtonHandler = this.modifyAccountButton.bind(this);
    }
    /**
    Handlers from Event Dispatcher
    */
    this.loadTableHandler = this.loadTable.bind(this);
    this.refreshHandler = this.refreshTable.bind(this);
    return this;
  }

  enable(tableType) {
    if (tableType === 'manage-accounts') {
      this.enableDeleteBtn();
    } else if (tableType === 'manage-users') {
      this.enableModifyBtn();
    }
    /**
     * Event Dispatcher for models
    */
    this.model.loadTableEvent.attach(this.loadTableHandler);
    this.model.deleteAccountEvent.attach(this.refreshHandler);
    this.model.modifyAccountEvent.attach(this.loadTableHandler);
    return this;
  }

  enableDeleteBtn() {
    this.tableBody
      .forEach(item => item.addEventListener('click', this.deleteAccountButtonHandler));
  }

  enableModifyBtn() {
    this.tableBody
      .forEach(item => item.addEventListener('click', this.modifyButtonHandler));
  }

  getTableRow(sender) {
    if (sender.target.type === 'button') {
      const td = sender.target.closest("td");
      const tr = td.closest('tr');
      // const trIndex = Number(tr.rowIndex - 1);
      const dataRowIndex = tr.getAttribute('index');
      const tableRowIndex = tr.rowIndex;
      const rowData = this.model.tableData.filter(account => account.id === Number(dataRowIndex));
      console.log('TABLE BUTTON CLICKED', sender.target);
      console.log('TABLE ROW INDEX AND DATA', dataRowIndex, rowData[0]);
      return {data: rowData[0], index: tableRowIndex };
    }
  }
  // notify model of delete operation
  deleteAccountButton(sender) {
    const rowData = this.getTableRow(sender);
    this.deleteAccountEvent.notify(rowData);
  } 

  modifyAccountButton(sender) {
    const rowData = this.getTableRow(sender);
    this.modifyAccountEvent.notify(rowData);
  }

  display(panel) {
    this.buildTable(panel);
  }

  buildTable(panel) {
    console.log('TABLE TO BE CREATED: ', panel);
    if (panel === 'manage-accounts') {
      // this.adminBody.innerHTML = this.createTable();
      this.createTableToDeleteAccounts();
      this.tableBody = document.querySelectorAll('#recordsTable tbody');
      this.deleteAccountButtonHandler = this.deleteAccountButton.bind(this);
      this.tableBody
      .forEach(item => item.addEventListener('click', this.deleteAccountButtonHandler));
    } else {
      // this.adminBody.innerHTML = this.createTable();
      this.createTableToActivateAccounts();
      this.tableBody = document.querySelectorAll('#recordsTable tbody');
      this.modifyAccountButtonHandler = this.modifyAccountButton.bind(this);
      this.tableBody
      .forEach(item => item.addEventListener('click', this.modifyAccountButtonHandler));
    }
  }

  createDomTable(tableContainer) {
    this.removeNode(this.adminBody);
    this.adminBody.appendChild(tableContainer);
  }

  deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }

  createTableToDeleteAccounts() {
    const btnClass = 'delete--btn btn btn--danger';
    const btnText = 'Delete';
    const btn = this.createRowButton(btnClass, btnText);
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

  createTableToActivateAccounts() {
    const btnClass = 'modify--btn btn btn--success';
    const btnText = 'Modify';
    const btn = this.createRowButton(btnClass, btnText);
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
      hide: [0, 2, 3], 
    };
    const table = this.createTable(config);
    this.createDomTable(table);
    
  }

  removeNode(nodeToRemove) {
    while (nodeToRemove.firstChild) {
      nodeToRemove.removeChild(nodeToRemove.firstChild);
    }

  }

  createRowButton(classAttr, text) {
    return `<button type="button" class="${classAttr}">${text}</button>`;
  }

  createTable(config = {}) {
    // console.log('SPECIAL CONFIGURATION: ', config);
    const tableContainer = document.createElement('div');
    tableContainer.setAttribute('class', 'gen--table');
    // NOW CREATE AN INPUT BOX TYPE BUTTON USING createElement() METHOD.
    // CREATE DYNAMIC TABLE.
    const table = document.createElement('table');

    // SET THE TABLE ID. 
    // WE WOULD NEED THE ID TO TRAVERSE AND EXTRACT DATA FROM THE TABLE.
    table.setAttribute('id', 'recordsTable');
    // check if data is not empty before making arrays of data keys and values
    const arrHead = config.data.length > 0 ? Object.keys(config.data[0]) : [];

    const arrValue = config.data.length > 0 ? config.data.map(data => Object.values(data)) : [];
    // console.log('TABLE HEADER: ', arrHead);
    // console.log('TABLE ROWS: ', arrValue);

    const header = table.createTHead();
    const body = table.createTBody();
    let tr = header.insertRow(-1);
    tr.setAttribute('class', 'table--row head');

    // config.columns is an array of columns to create data for
    // this loop adds the header data for each column
    for (let h = 0; h < config.columns.length; h++) {
        // TABLE HEADER. 
        let th = document.createElement('th');
        if (config.hide.find(elem => elem === h) !== undefined) {
          th.setAttribute('class', 'hide--column');
      } else if (config.columns[h] !== null) {
        // console.log('SPECIAL CONFIG: ', h, config.columns[h], typeof config.columns[h]); 
        th.setAttribute('class', 'table--column');
        th.innerHTML = config.columns[h].name;
      } else {
          // TABLE HEADER.  
          if (h === 0) th.setAttribute('class', 'table--column column1')
          else  th.setAttribute('class', 'table--column');
          th.innerHTML = config.header[h];
      } 
      tr.appendChild(th);
    }

    // return tables header only when there is no data;
    if (config.data.length === 0) {
      tableContainer.appendChild(table);
      return tableContainer;
    }
    
    // for each row data in the values array (array of array values)
    for (let c = 0; c <= arrValue.length - 1; c++) {
      tr = body.insertRow(-1);
      tr.setAttribute('class', 'table--row');
      tr.setAttribute('index', arrValue[c][0]);
      // for each column in the row, add data
      for (let j = 0; j < config.columns.length; j++) {
        let td = document.createElement('td'); // TABLE DEFINITION.
        td = tr.insertCell(-1);
        // console.log('CONFIG COLUMNS: ', j, config.columns[j]);
        // check if button
        if (config.hide.find(elem => elem === j) !== undefined) {
          td.setAttribute('class', 'hide--column');
        } else if (config.columns[j] !== null) {
          td.setAttribute('class', 'table--column');
          td.innerHTML = config.columns[j].content; 
          // console.log('APPENDED BUTTON!: ', config.columns[j].content);
          // set attribute of first column
        } else if ( j === 0) {
          td.setAttribute('class', 'table--column column1');
          td.innerHTML = arrValue[c][j];   // ADD VALUES TO EACH CELL.
        } else {
          td.setAttribute('class', 'table--column');
          td.innerHTML = arrValue[c][j];   // ADD VALUES TO EACH CELL.
        }
      }
    }

    tableContainer.appendChild(table);
    return tableContainer;
  }

  /* -------------------- Handlers From Event Dispatcher ----------------- */

  loadTable(sender, table) {
    console.log('RELOADING TABLE: ', table);
    this.display(table);
  }

  refreshTable (sender, payload) {
    console.log('MODEL PAYLOAD: ', payload, payload.row);
    // remove row from table;
    if (Number(payload.row) !== 0) {
      document.querySelector('#recordsTable').deleteRow(payload.row);
      return;
    }
    return;
  }

  /* -------------------- End Handlers From Event Dispatcher ----------------- */
}