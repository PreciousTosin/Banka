function logOut() {
  localStorage.clear();
	const testRegex = /admin|staff|profile/ig;
	const regexResult = testRegex.test(window.location.pathname);
	if (regexResult === true) {
		window.location.href = '../index.html';
		return;
	}
	window.location.href = './index.html';
}

function returnHome() {
	const testRegex = /admin|staff|profile|forgot-password/ig;
	const regexResult = testRegex.test(window.location.pathname);
	if (regexResult === true) {
		window.location.href = '../index.html';
		return;
	}
	window.location.href = './index.html';
}

function loggedOut(isLoggedIn, showAdmin, showUser) {
  const isIndex = window.location.pathname.split('/').slice(-1).join('') === 'index.html';
  const baseUrl = isIndex === true ? './' : '../';
	return `
	<div class="main-menu-header__container container">
		<a class="main-menu-header__branding" onclick="returnHome()">
			Banka
		</a>

		<!-- START: Navigation Toggle -->
		<button type="button" class="main-menu-header__navigationToggle" id="siteNavigationToggle">
			<svg
				class="menu-siteNavigationToggle"
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="48"
				viewBox="0 0 48 48"
			>
				<g fill="#011B33" fillRule="evenodd">
					<rect class="menu-siteNavigationToggle__barTop" width="28" height="2" x="8" y="16" rx="1.5" />
					<rect class="menu-siteNavigationToggle__barMiddle1" width="28" height="2" x="8" y="23" rx="1.5" />
					<rect class="menu-siteNavigationToggle__barMiddle2" width="28" height="2" x="8" y="23" rx="1.5" />
					<rect class="menu-siteNavigationToggle__barBottom" width="28" height="2" x="8" y="30" rx="1.5" />
				</g>
			</svg>
		</button>
		<!-- END: Navigation Toggle -->
		<!-- START: Header Navigation -->
		<div class="main-menu-header__navigation" id="siteNavigation">
			<!-- START: Main Navigation -->
			<nav class="main-menu-mainNavigation">
				<div class="main-menu-mainNavigation__container container">
					<ul class="main-menu-mainNavigation__menu">
						<li class="main-menu-mainNavigation__menuItem ${showUser === false && 'hidden' }">
							<a class="main-menu-mainNavigation__title" href="./profile/profile.html">Profile</a>
						</li>
						<li class="main-menu-mainNavigation__menuItem ${showUser === false && 'hidden' }">
							<a class="main-menu-mainNavigation__title" href="./transaction.html">Transaction</a>
						</li>
						<li class="main-menu-mainNavigation__menuItem ${showAdmin === false && 'hidden' }">
							<a class="main-menu-mainNavigation__title" href="./admin/admin.html">Admin</a>
						</li>
						<li class="main-menu-mainNavigation__menuItem ${isLoggedIn === "true" && 'hidden'}">
							<a class="main-menu-mainNavigation__title" href="./login.html">Login</a>
							<a class="main-menu-mainNavigation__title" href="./signup.html">Sign Up</a>
						</li>
					</ul>
				</div>
			</nav>
			<!-- END: Main Navigation -->
		</div>
		<!-- END: Header Navigation -->
	</div>`;
}

function loggedIn(isLoggedIn, showAdmin, showUser, showStaff) {
	const isIndex = window.location.pathname.split('/').slice(-1).join('') === 'index.html';
	const baseUrl = isIndex === true ? './' : '../';
	console.log('URL SPLITTING: ', window.location.pathname.split('/').slice(-1).join('') === 'index.html');
	return `
	<div class="main-menu-header__container container">
		<a class="main-menu-header__branding" onclick="returnHome()">
			Banka
		</a>

		<!-- START: Navigation Toggle -->
		<button type="button" class="main-menu-header__navigationToggle" id="siteNavigationToggle">
			<svg
				class="menu-siteNavigationToggle"
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="48"
				viewBox="0 0 48 48"
			>
				<g fill="#011B33" fillRule="evenodd">
					<rect class="menu-siteNavigationToggle__barTop" width="28" height="2" x="8" y="16" rx="1.5" />
					<rect class="menu-siteNavigationToggle__barMiddle1" width="28" height="2" x="8" y="23" rx="1.5" />
					<rect class="menu-siteNavigationToggle__barMiddle2" width="28" height="2" x="8" y="23" rx="1.5" />
					<rect class="menu-siteNavigationToggle__barBottom" width="28" height="2" x="8" y="30" rx="1.5" />
				</g>
			</svg>
		</button>
		<!-- END: Navigation Toggle -->
		<!-- START: Header Navigation -->
		<div class="main-menu-header__navigation" id="siteNavigation">
			<!-- START: Main Navigation -->
			<nav class="main-menu-mainNavigation">
				<div class="main-menu-mainNavigation__container container">
					<ul class="main-menu-mainNavigation__menu">
						<li class="main-menu-mainNavigation__menuItem ${isLoggedIn === false && 'hidden' }">
							<a class="main-menu-mainNavigation__title" href="${baseUrl}profile/profile.html">Profile</a>
						</li>
						<li class="main-menu-mainNavigation__menuItem ${showUser === false && 'hidden' }">
							<a class="main-menu-mainNavigation__title" href="${baseUrl}transaction.html">Transaction</a>
						</li>
						<li class="main-menu-mainNavigation__menuItem ${showAdmin === false && 'hidden' }">
							<a class="main-menu-mainNavigation__title" href="${baseUrl}admin/admin.html">Admin</a>
						</li>
						<li class="main-menu-mainNavigation__menuItem ${showStaff === false && 'hidden' }">
							<a class="main-menu-mainNavigation__title" href="${baseUrl}staff/staff.html">Staff</a>
						</li>
						<li class="main-menu-mainNavigation__menuItem ${isLoggedIn === "false" && 'hidden'}">
							<a class="main-menu-mainNavigation__title" onclick="logOut()">Sign Out</a>
						</li>
					</ul>
				</div>
			</nav>
			<!-- END: Main Navigation -->
		</div>
		<!-- END: Header Navigation -->
	</div>`;
}

function NavBar() {
	const isLoggedIn = localStorage.getItem('loggedIn');
	const isUser = localStorage.getItem('isUser');
	const isStaff = localStorage.getItem('isStaff');
	const isAdmin = localStorage.getItem('isAdmin');
	const showAdmin = isAdmin === 'true' && isLoggedIn === 'true';
	const showStaff = isStaff === 'true' && isLoggedIn === 'true';
	const showUser = isUser === 'true' && isLoggedIn === 'true';
	
	if (isLoggedIn === 'true') return loggedIn(isLoggedIn, showAdmin, showUser, showStaff);
	return loggedOut(isLoggedIn, showAdmin, showUser);
}