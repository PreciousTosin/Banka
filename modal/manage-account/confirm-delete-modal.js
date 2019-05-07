class ConfirmDeleteModal extends GenericModal {
  constructor(deleteFunc) {
    super();
    this.init();
    this.deleteFunc = deleteFunc;
  }

  init() {
    this.createModalBody();
    this.enableEvent();
  }

  createModalBody() {
    const modalBody = document.createElement('div');
    modalBody.classList.add('confirm--body');

    const messageBody = document.createElement('div');
    messageBody.append('Are you sure you want to delete this account?');
    messageBody.classList.add('message--body');
    modalBody.appendChild(messageBody);

    const btnGroup = document.createElement('div');
    btnGroup.classList.add('confirm--btn--group');

    const okButton = document.createElement('button');
    okButton.classList.add('btn', 'btn--primary', 'ok--btn');
    okButton.type = 'button';
    okButton.innerHTML = 'Ok';
    btnGroup.appendChild(okButton);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn', 'btn--danger', 'cancel--btn');
    cancelButton.type = 'button';
    cancelButton.innerHTML = 'Cancel';
    btnGroup.appendChild(cancelButton);

    modalBody.appendChild(btnGroup);

    this.createModalHeader('Delete Account');
    this.createModalContent(modalBody);
  }

  enableEvent() {
    this.okHandler = this.callDeleteAccount.bind(this);

    document.querySelector('.ok--btn')
      .addEventListener('click', this.okHandler, false);
    document.querySelector('.cancel--btn')
      .addEventListener('click', () => this.toggleModal(), false);
  }

  static toggleSpinner() {
    const spinner = document.querySelector('.spinner--element');
    const overlay = document.querySelector('.spinner--overlay');
    if (spinner.classList.contains('lds-spinner')) {
      spinner.classList.toggle('lds-spinner');
      overlay.classList.toggle('show-overlay');
    } else {
      spinner.classList.toggle('lds-spinner');
      overlay.classList.toggle('show-overlay');
    }
  }

  callDeleteAccount(sender) {
    ConfirmDeleteModal.toggleSpinner(); //start spinner
    this.toggleModal(); // close modal
    console.log('OK button clicked');
    this.deleteFunc();
  }
}