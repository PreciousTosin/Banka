class GenericModal {
  constructor() {
    this.modalType = 'generic';
    this.initGeneric();
    console.log('INITIALISED MODAL');
  }

  getGenericChildren() {
    this.btn = document.getElementById('modal_opener');
    this.modal = document.querySelector('.modal');
    this.modalBody = document.querySelector('.modal--body');
    this.modalHeader = document.querySelector('.modal--title');
    console.log('BODY: ', this.modalBody);
  }

  initGeneric() {
    this.getGenericChildren();
    this.enable();
  }

  enable() {
    // this.btn.addEventListener('click', this.toggleModal);
    this.toggleModalHandler = this.toggleModal.bind(this);
  }

  static removeNode(nodeToRemove) {
    while (nodeToRemove.firstChild) {
      nodeToRemove.removeChild(nodeToRemove.firstChild);
    }

  }

  createModalHeader(content) {
    this.modalHeader.innerHTML = content;
  }

  createModalContent(content) {
    GenericModal.removeNode(this.modalBody);
    this.modalBody.appendChild(content);
  }

  attachModalListeners(modalElm) {
    modalElm.querySelector('.close--modal').addEventListener('click', this.toggleModalHandler);
    modalElm.querySelector('.overlay').addEventListener('click', this.toggleModalHandler);
  }

  detachModalListeners(modalElm) {
    modalElm.querySelector('.close--modal').removeEventListener('click', this.toggleModalHandler);
    modalElm.querySelector('.overlay').removeEventListener('click', this.toggleModalHandler);
  }

  toggleModal() {
    const currentState = this.modal.style.display;

    // If modal is visible, hide it. Else, display it.
    if (currentState === 'none') {
      this.modal.style.display = 'block';
      this.attachModalListeners(this.modal);
    } else {
      this.modal.style.display = 'none';
      this.detachModalListeners(this.modal);
    }
  }
}

/* const btn = document.getElementById('modal_opener');
const modal = document.querySelector('.modal');

function attachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').addEventListener('click', toggleModal);
  modalElm.querySelector('.overlay').addEventListener('click', toggleModal);
}

function detachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').removeEventListener('click', toggleModal);
  modalElm.querySelector('.overlay').removeEventListener('click', toggleModal);
}

function toggleModal() {
  const currentState = modal.style.display;

  // If modal is visible, hide it. Else, display it.
  if (currentState === 'none') {
    modal.style.display = 'block';
    attachModalListeners(modal);
  } else {
    modal.style.display = 'none';
    detachModalListeners(modal);  
  }
}

btn.addEventListener('click', toggleModal); */