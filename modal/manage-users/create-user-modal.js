class CreateUserModal extends GenericModal {
  constructor(createFunc) {
    super();
    this.createFunc = createFunc;
    this.init();
  }

  init() {
    this.createForm();
    this.enableEvent();
  }

  createForm() {
    const createForm = createStaffUserForm();

    this.createModalHeader('Create New User');
    this.createModalContent(createForm);
  }

  enableEvent() {
    const form = document.querySelector('.create-staff-user-form');
    this.createHandler = this.callCreateUser.bind(this);
    form.addEventListener('submit', (e) => this.createHandler(e, form));
  }

  callCreateUser(sender, form) {
    sender.preventDefault();
    const fd = new FormData(form);
    const body = {};
    [...fd.entries()].forEach(entry => body[entry[0]] = entry[1]);
    this.toggleModal(); // close modal
    this.createFunc(body);
  }
}