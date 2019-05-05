function initTransactionTable() {
  console.log('SETTING UP TRANSACTION TABLE');
     const model = new TransactionTableModel(),
         view = new TransactionTableView(model),
         controller = new TransactionTableController(model, view);
  return controller;
 }