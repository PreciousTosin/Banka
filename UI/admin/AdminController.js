class AdminController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
    console.log('SETTING UP TABLE FROM CONTROLLER');
    this.table = '';
    this.changeTable(this.model.activePanel);
  }

  init() {
    this.setupHandlers()
      .enable();
  }

  setupHandlers() {
    this.addTaskHandler = this.addTask.bind(this);
    this.toggleAdminPanelHandler = this.toggleAdminPanel.bind(this);
    return this;
  }

  enable() {
    this.view.addTaskEvent.attach(this.addTaskHandler);
    this.view.toggleAdminPanelEvent.attach(this.toggleAdminPanelHandler);
    return this;
  }

  addTask(sender, args) {
    this.model.addTask(args.task);
  }

  changeTable(panel) {
     if (panel === 'manage-accounts') {
      this.table = initManageTable();
    } else if (panel === 'modify-accounts')  {
      this.table = initModifyTable();
    } else {
       this.table = initManageUserTable();
     }
  }

  toggleAdminPanel(sender, panel) {
    this.model.setSelectedPanel(panel);
    this.changeTable(panel);
  }
}