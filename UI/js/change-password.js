const toggleSpinner = () => {
  const spinner = document.querySelector('.spinner--element');
  const overlay = document.querySelector('.spinner--overlay');
  if (spinner.classList.contains('lds-spinner')) {
    spinner.classList.toggle('lds-spinner');
    overlay.classList.toggle('show-overlay');
  } else {
    spinner.classList.toggle('lds-spinner');
    overlay.classList.toggle('show-overlay');
  }
};

const errDisplay = (error) => {
  document.querySelector('.alert-danger').classList.toggle('display-alert');
  document.querySelector('.error-msg').innerHTML = error;
};

const removeError = () => {
  document.querySelector('.alert-danger').classList.remove('display-alert');
};

const getToken = () => {
  const path = window.location.search;
  return path.split('=')[1];
};

const goToLogin = () => window.location.href = '../login.html';

const forgotHandler = (e, form) => {
  e.preventDefault();
  // start spinner
  toggleSpinner();
  const formType = e.target.classList[0];
  const fd = new FormData(form);
  const body = {};
  [...fd.entries()].forEach(entry => body[entry[0]] = entry[1]);

  const forgotPassUrl ='https://bankar.herokuapp.com/api/v1/auth/forgot-password';
  // const forgotPassUrl ='http://localhost:9000/api/v1/auth/forgot-password';
  const headers = {
    'Content-Type': 'application/json',
  };
  fetch(forgotPassUrl, {
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then((response) => {
      if (response.status === 404 || response.status === 400 || response.status === 409 || response.status === 422) {
        toggleSpinner();
        response.json().then((object) => {
          // console.log(object.error);
          errDisplay(object.error);
        })
      } else if (response.status === 200) {
        toggleSpinner();
        response.json().then((object) => {
          const modal = new SuccessModal('Email Sent', object.message);
          modal.toggleModal();
          // console.log('success', object);
        })
      }
    })
};

const resetHandler = (e, form) => {
  e.preventDefault();
  // start spinner
  toggleSpinner();
  const formType = e.target.classList[0];
  const fd = new FormData(form);
  const body = {};
  [...fd.entries()].forEach(entry => body[entry[0]] = entry[1]);

  const payload = {
    token: getToken(),
    ...body,
  };

  const resetPassUrl ='https://bankar.herokuapp.com/api/v1/auth/reset-password';
  // const resetPassUrl ='http://localhost:9000/api/v1/auth/reset-password';
  const headers = {
    'Content-Type': 'application/json',
  };

  fetch(resetPassUrl, {
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify(payload)
  })
    .then((response) => {
      if (response.status === 404 || response.status === 400 || response.status === 409 || response.status === 422) {
        toggleSpinner();
        response.json().then((object) => {
          // console.log(object.error);
          errDisplay(object.error);
        })
      } else if (response.status === 200) {
        toggleSpinner();
        response.json().then((object) => {
          const modal = new SuccessModal('Password Reset', object.message);
          modal.toggleModal();
          setTimeout(goToLogin, 4000);
          // console.log('success', object);
        })
      }
    })
};

function initRecovery() {
  const forgotPassForm = document.querySelector('#form-forgot');
  const resetPassForm = document.querySelector('#form-reset');
  if (forgotPassForm !== null) forgotPassForm.addEventListener('submit', (e) => forgotHandler(e, forgotPassForm));
  if (resetPassForm !== null) resetPassForm.addEventListener('submit', (e) => resetHandler(e, resetPassForm));
}