function initManageTable() {
  console.log('SETTING UP ADMIN TABLE');
     const model = new ManageTableModel(),
         view = new ManageTableView(model),
         controller = new ManageTableController(model, view);
  return controller;
 }