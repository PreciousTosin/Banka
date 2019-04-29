class AdminController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
    this.table = initTable(this.model.activePanel);
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

  toggleAdminPanel(sender, panel) {
    this.model.setSelectedPanel(panel)
    this.table.changeTable(panel);
  }
};