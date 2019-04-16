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

$(document).ready(function() {
	$('#login-form').submit(function(event) {
		event.preventDefault();
		const formData = {
			email: $('input[name=email]').val(),
			password: $('input[name=password]').val()
		};
		console.log('LOGGED IN: ', formData);
		LogIn(formData);
	});
});
