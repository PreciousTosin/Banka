window.onload = function () {
  console.log('SETTING UP BANKA APP');
     const model = new AdminModel(),
         view = new AdminView(model),
         controller = new AdminController(model, view);
 };