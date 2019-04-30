function LogIn(payload) {
  console.log('PAYLOAD: ', payload);
  const { type, isadmin, token } = payload;
	if (type === 'staff' && isadmin === true) {
		localStorage.setItem('loggedIn', 'true');
		localStorage.setItem('isAdmin', 'true');
		localStorage.setItem('token', token);
	} else if (type === 'staff' && isadmin === false) {
		localStorage.setItem('loggedIn', 'true');
		localStorage.setItem('isStaff', 'true');
    localStorage.setItem('token', token);
	} else {
		localStorage.setItem('loggedIn', 'true');
		localStorage.setItem('isUser', 'true');
    localStorage.setItem('token', token);
	}
	window.location.href = './index.html';
}

const errDisplay = (error) => {
  document.querySelector('.alert-danger').classList.toggle('display-alert');
  document.querySelector('.error-msg').innerHTML = error;
};

const removeError = () => {
  document.querySelector('.alert-danger').classList.remove('display-alert');
};


const authHandler = (e, form) => {
  e.preventDefault();
  // start spinner
  toggleSpinner();
  console.log('SIGNUP FORM TARGET', e.target.classList[0]);
  const formType = e.target.classList[0];
  const fd = new FormData(form);
  const body = {};
  [...fd.entries()].forEach(entry => body[entry[0]] = entry[1]);
  console.log(body);
  /* const body = new URLSearchParams();
  for (const pair of new FormData(form)) {
    body.append(pair[0], pair[1]);
  } */

  console.log(body);

  if (formType === 'login') {
  	const loginUrl ='https://bankar.herokuapp.com/api/v1/auth/signin';
    const headers = {
      'Content-Type': 'application/json',
    };
    fetch(loginUrl, {
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then((response) => {
        if (response.status === 404 || response.status === 400 || response.status === 409) {
          toggleSpinner();
          response.json().then((object) => {
            console.log(object.error);
            errDisplay(object.error);
          })
        } else if (response.status === 200) {
          toggleSpinner();
          response.json().then((object) => {
            console.log('success', object);
            LogIn(object.data);
          })
        }
      })
	} else {
    const signUpUrl ='https://bankar.herokuapp.com/api/v1/auth/signup';
    const headers = {
      'Content-Type': 'application/json',
    };
    fetch(signUpUrl, {
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then((response) => {
        if (response.status === 404 || response.status === 400 || response.status === 409) {
          toggleSpinner();
          response.json().then((object) => {
            console.log(object.error);
            errDisplay(object.error);
          })
        } else if (response.status === 200) {
          toggleSpinner();
          response.json().then((object) => {
            console.log('success', object);
            LogIn(object.data);
          })
        }
      })
  }
};

const toggleSpinner = () => {
  const spinner = document.querySelector('.spinner--element');
  if (spinner.classList.contains('lds-spinner')) {
    spinner.classList.toggle('lds-spinner');
	} else {
    spinner.classList.toggle('lds-spinner');
	}
};

window.onload = function() {
  // navbar init
  const navbarContainer = document.querySelector(".main-menu-header");
  navbarContainer.innerHTML = NavBar();

  // Code block to toggle navbar visibility
  const siteNavigationToggle = document.getElementById('siteNavigationToggle');
  const siteNavigation = document.getElementById('siteNavigation');

  siteNavigationToggle.addEventListener('click', () => {
    if (siteNavigation.classList.contains('isActive')) {
      siteNavigationToggle.removeAttribute('aria-pressed');
    } else {
      siteNavigationToggle.setAttribute('aria-pressed', true);
    }

    document.body.classList.toggle('mobile-overflowHidden');

    siteNavigation.classList.toggle('isActive');
    siteNavigationToggle.classList.toggle('isActive');
  });

  // login form handler

  const form = document.querySelector("#auth-form");
  form.addEventListener("submit", (e) => authHandler(e, form));
};