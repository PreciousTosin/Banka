class ModifyUserModal extends GenericModal {
  constructor(modifyFunc) {
    super();
    this.init();
    this.modifyFunc = modifyFunc;
  }

  init() {
    this.createForm();
    this.enableEvent();
  }

  createForm() {
    const modifyForm = document.createElement('FORM');
    modifyForm.name = 'modifyForm';
    modifyForm.classList.add('modify--user--form');
    modifyForm.method = 'POST';

    const formGroup = document.createElement('div');
    formGroup.classList.add('form--group');
    modifyForm.appendChild(formGroup);
    const selectLabel = document.createElement('label');
    selectLabel.for = 'select-activate';
    const optionsList = ['active', 'inactive'];
    const selectActivate = document.createElement('select');
    selectActivate.id = 'select-activate';
    selectActivate.classList.add('form--control');
    selectActivate.name = 'status';
    formGroup.appendChild(selectActivate);

    optionsList.forEach((item) => {
      let option = document.createElement('option');
      option.value = item;
      option.text = item;
      selectActivate.appendChild(option);
    });

    const formButton = document.createElement('button');
    formButton.classList.add('btn', 'btn--primary', 'modify--user--btn');
    formButton.type = 'submit';
    formButton.innerHTML = 'Modify';
    modifyForm.appendChild(formButton);

    this.createModalHeader('Modify User Status');
    this.createModalContent(modifyForm);
  }

  enableEvent() {
    const form = document.querySelector('.modify--user--form');
    this.modifyHandler = this.callModifyUser.bind(this);
    form.addEventListener('submit', (e) => this.modifyHandler(e, form));
  }

  callModifyUser(sender, form) {
    sender.preventDefault();
    const fd = new FormData(form);
    const body = {};
    [...fd.entries()].forEach(entry => body[entry[0]] = entry[1]);
    this.toggleModal(); // close modal
    this.modifyFunc(body);
  }
}