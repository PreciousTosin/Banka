class TransactionTableModel extends TableModel {
  static dateTime(offset) {
    return new Date(Date.now() + offset);
  }
  constructor(data) {
    super();
    this.tableHeader = [ 'id', 'createdon', 'type', 'accountnumber', 'cashier', 'amount', 'oldbalance', 'newbalance' ];
    this.tableData = data.length === 0 ? [] : data;
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