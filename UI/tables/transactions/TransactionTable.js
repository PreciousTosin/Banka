function initTransactionTable(data) {
  console.log('SETTING UP TRANSACTION TABLE');
     const model = new TransactionTableModel(data),
         view = new TransactionTableView(model),
         controller = new TransactionTableController(model, view);
  return controller;
 }