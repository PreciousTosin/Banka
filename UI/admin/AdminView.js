class AdminView {
  constructor(model) {
    this.model = model;
    this.addTaskEvent = new Event(this);
    this.toggleAdminPanelEvent = new Event(this);
    this.init();
  }

  init() {
    this.createChildren()
      .setupHandlers()
      .enable();
  }

  createChildren() {
    // cache the document object
    this.adminContainer = document.querySelector('.admin--container');
    this.adminHeaderItems = document.querySelectorAll('.admin--header--item');
    this.adminBody = document.querySelector('.admin--body');
    return this;
  }

  setupHandlers() {
    this.addTaskButtonHandler = this.addTaskButton.bind(this);
    this.toggleAdminPanelButtonHandler = this.toggleAdminPanelButton.bind(this);
    /**
    Handlers from Event Dispatcher
    */
    this.addTaskHandler = this.addTask.bind(this);
    this.toggleAdminPanelHandler = this.toggleAdminPanel.bind(this);
    return this;
  }

  enable() {
    // this.$addTaskButton.click(this.addTaskButtonHandler);
    this.adminHeaderItems.forEach((item) => {
      item.addEventListener('click', this.toggleAdminPanelButtonHandler, false);
    });

    /**
     * Event Dispatcher
    */
    this.model.addTaskEvent.attach(this.addTaskHandler);
    this.model.toggleAdminPanelEvent.attach(this.toggleAdminPanelHandler);
    return this;
  }

  addTaskButton() {
    this.addTaskEvent.notify({
      task: this.$taskTextBox.val()
    });
  }

  toggleAdminPanelButton() {
    const element = document.querySelector(`#${event.target.getAttribute('id')}`);
    const panels = document.querySelectorAll('.admin--header--item');
    const containsActive = /active/ig.test(event.target.getAttribute('class'));
    if (containsActive === false) {
      panels.forEach((panel) => { 
        panel.classList.forEach(classitem => {
          if (/active/ig.test(classitem)) {
            panel.classList.remove('active');
          }
        });
      });
      element.classList.add('active');
    }
    this.toggleAdminPanelEvent.notify(event.target.getAttribute('id'));
  }

    

  show(panel) {
    this.buildTable(panel);
  }

  buildTable(panel) {
    console.log('BUILDING TABLE FOR: ', panel);
  }

  /* -------------------- Handlers From Event Dispatcher ----------------- */

  addTask() {
    this.show();
  }

  toggleAdminPanel(sender, panel) {
    this.show(panel);
  }

  /* -------------------- End Handlers From Event Dispatcher ----------------- */
}