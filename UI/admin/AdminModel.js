class AdminModel {
  constructor() {
    this.tasks = [];
    this.panels = ['manage-accounts', 'modify-accounts', 'manage-users'];
    this.activePanel = 'manage-accounts';
    this.addTaskEvent = new Event(this);
    this.toggleAdminPanelEvent = new Event(this);
  }

  addTask(task) {
    this.tasks.push({
      taskName: task,
      taskStatus: 'uncompleted'
    });
    this.addTaskEvent.notify();
  }

  setSelectedPanel(panel) {
    this.activePanel = panel;
    console.log('PANEL CLICKING PICKED BY MODEL: ', this.activePanel);
    this.toggleAdminPanelEvent.notify(this.activePanel);
  }

  getTasks() {
    return this.tasks;
  }
}