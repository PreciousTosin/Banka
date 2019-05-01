class ModifyModal extends GenericModal {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.createForm();
  }

  createForm() {
    const modifyForm = document.createElement('FORM');
    modifyForm.name = 'modifyForm';
    modifyForm.classList.add('modify--form');
    modifyForm.method = 'POST';

    const formGroup = document.createElement('div');
    formGroup.classList.add('form--group');
    modifyForm.appendChild(formGroup);
    const selectLabel = document.createElement('label');
    selectLabel.for = 'select-activate';
    const optionsList = ['activate', 'deactivate'];
    const selectActivate = document.createElement('select');
    selectActivate.id = 'select-activate';
    selectActivate.classList.add('form--control');
    selectActivate.name = 'selectActivate';
    formGroup.appendChild(selectActivate);

    optionsList.forEach((item) => {
      let option = document.createElement('option');
      option.value = item;
      option.text = item;
      selectActivate.appendChild(option);
    });

    const formButton = document.createElement('button');
    formButton.classList.add('btn');
    formButton.classList.add('btn--primary');
    formButton.type = 'button';
    formButton.innerHTML = 'Modify';
    modifyForm.appendChild(formButton);

    this.createModalHeader('Modify Account Status');
    this.createModalContent(modifyForm);
  }


}