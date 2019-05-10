function initManageUserTable() {
  console.log('SETTING UP ADMIN TABLE');
     const model = new ManageUserTableModel(),
         view = new ManageUserTableView(model),
         controller = new ManageUserTableController(model, view);
  return controller;
 }