function initModifyTable(activeTable) {
  console.log('SETTING UP ADMIN MODIFY TABLE');
     const model = new AdminTableModel(activeTable),
         view = new ModifyTableView(model),
         controller = new ModifyTableController(model, view);
  return controller;
 }