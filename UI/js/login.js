function LogIn(payload) {
	if (payload.password === 'admin') {
		localStorage.setItem('loggedIn', 'true');
		localStorage.setItem('isAdmin', 'true');
	} else if (payload.password === 'staff') {
		localStorage.setItem('loggedIn', 'true');
		localStorage.setItem('isStaff', 'true');
	} else {
		localStorage.setItem('loggedIn', 'true');
		localStorage.setItem('isUser', 'true');
	}
	window.location.href = './index.html';
}



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
  	const url ='http://localhost:9000/api/v1/auth/signin';
    const headers = {
      'Content-Type': 'application/json',
    };
  	const accUrl = 'https://bankar.herokuapp.com/api/v1/accounts';
    fetch(url, {
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then(function(response) {
        toggleSpinner();
        if (response.status === 404 || response.status === 400 || response.status === 409) {
          response.json().then(function(object) {
            console.log(object.error)
          })
        } else if (response.status === 200) {
          toggleSpinner();
          response.json().then(function(object) {
            console.log('success', object);
          })
        }
      })
    /* getFetchApi(accUrl)
      .then(response => {
        toggleSpinner();
        const items = response;
        console.log('RESPONSE: ', items);
      })
      .catch(error => {
      	toggleSpinner();
				console.log('ERROR: ', error);
      }); */
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