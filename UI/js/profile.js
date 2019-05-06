function initializeProfile() {
  // initialize modal
  const modal = new CreateAccountModal();

  const accButton = document.querySelector('.account--button');
  accButton.addEventListener('click', () => modal.toggleModal(), false);
}