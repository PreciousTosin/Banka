function initTable(activeTable) {
  console.log('SETTING UP ADMIN TABLE');
     const model = new TableModel(activeTable),
         view = new TableView(model),
         controller = new TableController(model, view);
  return controller;
 };