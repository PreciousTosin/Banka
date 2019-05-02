class ManageUserModal extends GenericModal {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.createForm();
  }

  createForm() {
    const createForm = createStaffUserForm();

    this.createModalHeader('Create New User');
    this.createModalContent(createForm);
  }


}