function generateProfile(user) {
  return `<div class="profile--details">
						<div class="profile--identification">
							<h2>${user.firstName}${' '}${user.lastName}</h2>
							<p>a ${user.type}</p>
						</div>
						<hr />
						<div class="more--details">
							<ul>
								<li>
									<span class="profile--icon"><i class="fas fa-user"></i></span>
									<div>${user.status}</div>
								</li>
								<li>
									<span class="profile--icon"><i class="fas fa-envelope-open-text"></i></span>
									<div>${user.email}</div>
								</li>
							</ul>
						</div>
						<hr />
						<div class="accounts--container">
							<div class="accounts">
							</div>
							<div class="account--button">
								<button type="button" class="btn btn--primary">Create Account</button>
							</div>
						</div>
						<hr />
						<div class="additional--details">
							<p>User Id: ${user.id}</p>
						</div>
					</div>`;
}

function generateAccounts() {
  const accounts = [
    {
      accountNumber: 28975468,
      balance: 50000,
    }, {
      accountNumber: 28573214,
      balance: 10000,
    },
  ];
  const accountContainer = document.querySelector('.accounts');
  accounts.forEach((account) => {
    const akant = bankAccount(account);
    accountContainer.appendChild(akant);
  });
}

function bankAccount(account) {
  const accountPanel = document.createElement('div');
  accountPanel.classList.add('panel', 'panel-default', 'card-input');
  const panelHeader = document.createElement('div');
  panelHeader.append('Account');
  accountPanel.appendChild(panelHeader);
  const panelBody = document.createElement('div');
  panelHeader.classList.add('panel-heading');
  panelBody.classList.add('panel-body');
  const accountDiv = document.createElement('div');
  accountDiv.innerHTML = 'Account No - ';
  const accountSpan = document.createElement('span');
  accountSpan.append(account.accountNumber);
  accountDiv.appendChild(accountSpan);
  panelBody.appendChild(accountDiv);

  const balanceDiv = document.createElement('div');
  balanceDiv.innerHTML = 'Balance - ';
  const balanceSpan = document.createElement('span');
  balanceSpan.append(account.balance);
  balanceDiv.appendChild(balanceSpan);
  panelBody.appendChild(balanceDiv);
  accountPanel.appendChild(panelBody);
  return accountPanel;
}