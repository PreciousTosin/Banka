class ChargeModal extends GenericModal {
  constructor(chargeFunc) {
    super();
    this.chargeFunc = chargeFunc;
    this.init();
  }

  init() {
    this.createForm();
    this.enableEvent();
  }

  createForm() {
    const chargeForm = document.createElement('FORM');
    chargeForm.name = 'chargeForm';
    chargeForm.classList.add('charge--form');
    chargeForm.method = 'POST';

    const formGroup = document.createElement('div');
    formGroup.classList.add('form--group');
    chargeForm.appendChild(formGroup);
    const selectLabel = document.createElement('label');
    selectLabel.for = 'select-charge';
    selectLabel.innerHTML = 'Type';
    formGroup.appendChild(selectLabel);
    const optionsList = ['credit', 'debit'];
    const selectCharge = document.createElement('select');
    selectCharge.id = 'select-charge';
    selectCharge.classList.add('form--control');
    selectCharge.name = 'type';
    formGroup.appendChild(selectCharge);
    optionsList.forEach((item) => {
      let option = document.createElement('option');
      option.value = item;
      option.text = item;
      selectCharge.appendChild(option);
    });

    const inputFormGroup = document.createElement('div');
    inputFormGroup.classList.add('form--group');
    chargeForm.appendChild(inputFormGroup);
    const amountLabel = document.createElement('label');
    amountLabel.for = 'charge-amount';
    amountLabel.innerHTML = 'Amount';
    inputFormGroup.appendChild(amountLabel);
    const inputAmount = document.createElement('input');
    inputAmount.id = 'charge-amount';
    inputAmount.name = 'amount';
    inputAmount.type = 'number';
    inputAmount.classList.add('form--control');
    inputFormGroup.appendChild(inputAmount);

    const formButton = document.createElement('button');
    const btnformGroup = document.createElement('div');
    btnformGroup.classList.add('btn--group');
    formButton.classList.add('btn');
    formButton.classList.add('btn--primary');
    formButton.type = 'submit';
    formButton.innerHTML = 'Charge';
    btnformGroup.appendChild(formButton);
    chargeForm.appendChild(btnformGroup);

    this.createModalHeader('Create Transaction');
    this.createModalContent(chargeForm);
  }

  enableEvent() {
    const form = document.querySelector('.charge--form');
    this.chargeHandler = this.callChargeAccount.bind(this);
    form.addEventListener('submit', (e) => this.chargeHandler(e, form));
  }

  callChargeAccount(sender, form) {
    sender.preventDefault();
    const fd = new FormData(form);
    const body = {};
    [...fd.entries()].forEach(entry => body[entry[0]] = entry[1]);
    this.toggleModal(); // close modal
    this.chargeFunc(body);
  }
}