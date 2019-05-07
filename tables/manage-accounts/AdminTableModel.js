class AdminTableModel extends TableModel {
  static dateTime(offset) {
    return new Date(Date.now() + offset);
  }
  constructor() {
    super();
    this.tableHeader = [ 'id', 'accountNumber', 'createdOn', 'owner', 'type', 'status', 'balance' ];
    this.tableData = [
      {
        id: 58769874154475111,
        accountnumber: 2816408925,
        createdon: AdminTableModel.dateTime(0),
        owner: 23568974210520,
        type: 'savings',
        status: 'active',
        balance: 500.00,
      }, {
        id: 37091127128041553,
        accountnumber: 2869502843,
        createdon: AdminTableModel.dateTime(24 * 60 * 60 * 1000),
        owner: 65897567145632,
        type: 'current',
        status: 'draft',
        balance: 1000.00,
      },
    ];
    this.tableType = 'manage-accounts';
    this.loadTableEvent = new Event(this);
    this.deleteAccountEvent = new Event(this);
    this.modifyAccountEvent = new Event(this);
    this.toggleSpinnerEvent = new Event(this);
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

  deleteAccount(payload) {
    const { data, index } = payload;
    setTimeout(() => {
      const newData = this.tableData.filter(account => account.accountNumber !== data.accountNumber);
      this.tableData = newData;
      this.deleteAccountEvent.notify({ msg: 'account-deleted', row: index, table: this.tableType });
    }, 2000);
  }

  modifyAccount(payload) {
    console.log('ACTIVATE OR DEACTIVATE: ', payload);
    this.modifyAccountEvent.notify(payload);
  }
}