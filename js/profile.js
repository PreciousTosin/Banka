function initializeProfile() {
  const token = localStorage.getItem('token');
  const decoded = jwt_decode(token);
  // console.log('DECODED: ', decoded);
  // create partial application of new account function
  const newAccount = (payload) => createAccount(token, payload);
  // initialize modal and pass in function
  const modal = new CreateAccountModal(newAccount);

  const profile = document.querySelector('.profile--information');
  profile.innerHTML = generateProfile(decoded);
  const payload = {
    email: decoded.email,
    token: token,
  };
  fetchAccounts(payload)
    .then((data) => {
      console.log('ACCOUNTS DATA: ', data);
      generateAccounts(data);
    })
    .catch(error => {
      console.log('Accounts Error: ', error);
    });

  const accButton = document.querySelector('.account--button');
  accButton.addEventListener('click', () => modal.toggleModal(), false);
}

function fetchAccounts({ email, token }) {
  // toggle spinner
  toggleSpinner();
  const accountsUrl =`https://bankar.herokuapp.com/api/v1/user/${email}/accounts`;
  const bearer = 'Bearer ' + token;
  const headers = {
    'Authorization': bearer,
    'Content-Type': 'application/json',
  };
  return new Promise(((resolve, reject) => fetch(accountsUrl, {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: { ...headers },
  })
    .then((response) => {
      if (response.status === 404 || response.status === 400 || response.status === 409 || response.status === 401) {
        toggleSpinner();
        response.json().then((object) => {
          // console.log(object.error);
          reject(object.error);
        })
      } else if (response.status === 200) {
        toggleSpinner();
        response.json().then((object) => {
          // console.log('success', object);
          resolve(object.data);
        })
      }
    })
  ));
}

function createAccount(token, body) {
  // toggle spinner
  toggleSpinner();
  const accountsUrl ='https://bankar.herokuapp.com/api/v1/accounts';
  const bearer = 'Bearer ' + token;
  const headers = {
    'Authorization': bearer,
    'Content-Type': 'application/json',
  };
  return new Promise(((resolve, reject) => fetch(accountsUrl, {
    method: 'POST',
    withCredentials: true,
    credentials: 'include',
    headers: { ...headers },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status === 404 || response.status === 400 || response.status === 409 || response.status === 401) {
        toggleSpinner();
        response.json().then((object) => {
          // console.log(object.error);
          reject(object.error);
        })
      } else if (response.status === 200) {
        toggleSpinner();
        response.json().then((object) => {
          // reload profile
          initializeProfile();
          resolve(object.data);
        })
      }
    })));
}

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