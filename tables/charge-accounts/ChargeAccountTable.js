function initChargeTable() {
  console.log('SETTING UP STAFF CHARGE TABLE');
     const model = new ChargeTableModel(),
         view = new ChargeTableView(model),
         controller = new ChargeTableController(model, view);
  return controller;
 }