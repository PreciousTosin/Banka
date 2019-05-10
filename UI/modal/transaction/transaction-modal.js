class TransactionModal extends GenericModal {
  constructor(data) {
    super();
    this.init(data);
  }

  init(data) {
    const transactionView = viewTransaction(data);
    this.createModalHeader('Transaction Details');
    this.createModalContent(transactionView);
  }
}