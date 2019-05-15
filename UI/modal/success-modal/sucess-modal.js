class SuccessModal extends GenericModal {
  constructor(header, content) {
    super();
    this.init(header, content);
  }

  init(header, content) {
    this.createModalHeader(header);
    this.createModalBody(content);
  }

  createModalBody(content) {
    const body = document.createElement('p');
    body.classList.add('text-center');
    body.innerHTML = content;
    this.createModalContent(body);
  }
}