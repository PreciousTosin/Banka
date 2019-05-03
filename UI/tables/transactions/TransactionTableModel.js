class TransactionTableModel extends TableModel {
  static dateTime(offset) {
    return new Date(Date.now() + offset);
  }
  constructor() {
    super();
    this.tableHeader = [ 'id', 'accountNumber', 'createdOn', 'owner', 'type', 'status', 'balance' ];
    this.tableData = [
      {
        id: 612879,
        createdOn: TransactionTableModel.dateTime(0),
        type: 'credit',
        accountNumber: 281640892,
        cashier: 36956,
        amount: '150',
        oldBalance: '350',
        newBalance: '500',
      }, {
        id: 706845,
        createdOn: TransactionTableModel.dateTime(12 * 60 * 60 * 1000),
        type: 'credit',
        accountNumber: 280872904,
        cashier: 36956655,
        amount: '900',
        oldBalance: '0',
        newBalance: '900',
      },
    ];
    this.tableType = 'transactions';
    this.loadTableEvent = new Event(this);
    this.viewTransactionEvent = new Event(this);
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

  viewTransaction(payload) {
    this.viewTransactionEvent.notify({});
  }

}