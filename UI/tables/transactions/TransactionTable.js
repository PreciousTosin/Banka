function initTransactionTable(activeTable) {
  console.log('SETTING UP ADMIN MODIFY TABLE');
     const model = new TransactionTableModel(activeTable),
         view = new TransactionTableView(model),
         controller = new TransactionTableController(model, view);
  return controller;
 }