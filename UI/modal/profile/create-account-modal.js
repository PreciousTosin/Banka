class CreateAccountModal extends GenericModal {
  constructor(createFunction) {
    super();
    this.init();
    this.createFunction = createFunction;
  }

  init() {
    this.createForm();
    this.enableEvents();
  }

  createForm() {
    const createAccountForm = document.createElement('FORM');
    createAccountForm.name = 'createAccountForm';
    createAccountForm.classList.add('create--account--form');
    createAccountForm.method = 'POST';

    const formGroup = document.createElement('div');
    formGroup.classList.add('form--group');
    createAccountForm.appendChild(formGroup);
    const selectLabel = document.createElement('label');
    selectLabel.for = 'select-account-type';
    selectLabel.innerHTML = 'Account Type';
    formGroup.appendChild(selectLabel);
    const optionsList = ['savings', 'current'];
    const selectAccountType = document.createElement('select');
    selectAccountType.id = 'select-account-type';
    selectAccountType.classList.add('form--control');
    selectAccountType.name = 'type';
    formGroup.appendChild(selectAccountType);

    optionsList.forEach((item) => {
      let option = document.createElement('option');
      option.value = item;
      option.text = item;
      selectAccountType.appendChild(option);
    });

    const formBtnGroup = document.createElement('div');
    formBtnGroup.classList.add('btn--group');
    const formButton = document.createElement('button');
    formButton.classList.add('btn');
    formButton.classList.add('btn--primary', 'create--account');
    formButton.type = 'submit';
    formButton.innerHTML = 'Create Account';
    formBtnGroup.appendChild(formButton);
    createAccountForm.appendChild(formBtnGroup);

    this.createModalHeader('Create New Account');
    this.createModalContent(createAccountForm);
  }

  enableEvents() {
    const form = document.querySelector(".create--account--form");
    this.createHandler = this.createAccount.bind(this);
    form.addEventListener("submit", (e) => this.createHandler(e, form));

  }

  createAccount(sender, form) {
    sender.preventDefault();
    const fd = new FormData(form);
    const body = {};
    [...fd.entries()].forEach(entry => body[entry[0]] = entry[1]);
    this.toggleModal();
    this.createFunction(body);
  }
}