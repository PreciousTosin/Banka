class ChargeModal extends GenericModal {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.createForm();
  }

  createForm() {
    const chargeForm = document.createElement('FORM');
    chargeForm.name = 'chargeForm';
    chargeForm.classList.add('charge--form');
    chargeForm.method = 'POST';

    const inputFormGroup = document.createElement('div');
    inputFormGroup.classList.add('form--group');
    chargeForm.appendChild(inputFormGroup);
    const amountLabel = document.createElement('label');
    amountLabel.for = 'charge-amount';
    amountLabel.innerHTML = 'Amount';
    inputFormGroup.appendChild(amountLabel);
    const inputAmount = document.createElement('input');
    inputAmount.id = 'charge-amount';
    inputAmount.name = 'chargeAmount';
    inputAmount.classList.add('form--control');
    inputFormGroup.appendChild(inputAmount);

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
    selectCharge.name = 'selectCharge';
    formGroup.appendChild(selectCharge);
    optionsList.forEach((item) => {
      let option = document.createElement('option');
      option.value = item;
      option.text = item;
      selectCharge.appendChild(option);
    });

    const formButton = document.createElement('button');
    formButton.classList.add('btn');
    formButton.classList.add('btn--primary');
    formButton.type = 'button';
    formButton.innerHTML = 'Charge';
    chargeForm.appendChild(formButton);

    this.createModalHeader('Create Transaction');
    this.createModalContent(chargeForm);
  }


}