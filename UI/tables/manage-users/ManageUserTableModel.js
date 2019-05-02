class ManageUserTableModel extends TableModel {
  static dateTime(offset) {
    return new Date(Date.now() + offset);
  }
  constructor() {
    super();
    this.tableHeader = [ 'Id', 'FirstName', 'LastName', 'Type', 'IsAdmin', 'Status', 'Created'];
    this.tableData = [
      {
        id: 3695665,
        firstName: 'John',
        lastName: 'Wayne',
        type: 'staff',
        IsAdmin: false,
        status: 'active',
        createdOn: ManageUserTableModel.dateTime(0),
      }, {
        id: 6589756,
        firstName: 'James',
        lastName: 'Donovan',
        type: 'client',
        IsAdmin: false,
        status: 'active',
        createdOn: ManageUserTableModel.dateTime(12 * 60 * 60 * 1000),
      }, {
        id: 5487555,
        firstName: 'Tyler',
        lastName: 'Ross',
        type: 'staff',
        IsAdmin: true,
        status: 'active',
        createdOn: ManageUserTableModel.dateTime(18 * 60 * 60 * 1000),
      }, {
        id: 2356897,
        firstName: 'Micheal',
        lastName: 'Flannigan',
        type: 'client',
        IsAdmin: false,
        status: 'inactive',
        createdOn: ManageUserTableModel.dateTime(24 * 60 * 60 * 1000),
      },
    ];
    this.tableType = 'manage-users';
    this.loadTableEvent = new Event(this);
    this.modifyUserEvent = new Event(this);
    this.addUserEvent = new Event(this);
  }

  getTableData() {
    return this.tableData;
  }

  setTableType(table) {
    this.tableType = table;
  }

  loadTable(table) {
    console.log('TABLE TO BE SET: ', table);
    this.setTableType(table);
    this.loadTableEvent.notify(this.tableType);
  }

  createUser(payload) {
    const { data, index } = payload;
    const newData = this.tableData.push(data);
    this.tableData = newData;
    this.addUserEvent.notify({ msg: 'account-created', row: index, table: this.tableType });
  }

  modifyUser(payload) {
    console.log('ACTIVATE OR DEACTIVATE USER: ', payload);
    this.modifyUserEvent.notify(payload);
  }
}