function initDeleteTable() {
  console.log('SETTING UP ADMIN TABLE');
     const model = new DeleteTableModel(),
         view = new DeleteTableView(model),
         controller = new DeleteTableController(model, view);
  return controller;
 }