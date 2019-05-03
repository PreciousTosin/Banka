class ChargeTableModel extends TableModel {
  static dateTime(offset) {
    return new Date(Date.now() + offset);
  }
  constructor() {
    super();
    this.tableHeader = [ 'id', 'accountNumber', 'createdOn', 'owner', 'type', 'status', 'balance' ];
    this.tableData = [
      {
        id: 58769874154475111,
        accountNumber: 2816408925,
        createdOn: ChargeTableModel.dateTime(0),
        owner: 23568974210520,
        type: 'savings',
        status: 'active',
        balance: 500.00,
      }, {
        id: 37091127128041553,
        accountNumber: 2869502843,
        createdOn: ChargeTableModel.dateTime(24 * 60 * 60 * 1000),
        owner: 65897567145632,
        type: 'current',
        status: 'draft',
        balance: 1000.00,
      },
    ];
    this.tableType = 'charge-accounts';
    this.loadTableEvent = new Event(this);
    this.chargeAccountEvent = new Event(this);
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

  chargeAccount(payload) {
    console.log('CHARGED ACCOUNT: ', payload);
    // const { data, index } = payload;
    // const newData = this.tableData.filter(account => account.accountNumber !== data.accountNumber);
    // this.tableData = newData;
    // this.chargeAccountEvent.notify({ msg: 'account-deleted', row: index, table: this.tableType });
    this.chargeAccountEvent.notify();
  }
}