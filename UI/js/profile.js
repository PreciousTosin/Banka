function initializeProfile() {
  const token = localStorage.getItem('token');
  const decoded = jwt_decode(token);
  // console.log('DECODED: ', decoded);
  // initialize modal
  const modal = new CreateAccountModal();

  const profile = document.querySelector('.profile--information');
  profile.innerHTML = generateProfile(decoded);
  generateAccounts();

  const accButton = document.querySelector('.account--button');
  accButton.addEventListener('click', () => modal.toggleModal(), false);
}