class ViewAccountModal extends GenericModal {
  constructor(data) {
    super();
    this.init(data);
  }

  init(data) {
    const accountView = viewBankAccount(data);
    this.createModalHeader('Account Details');
    this.createModalContent(accountView);
  }
}