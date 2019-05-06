function generateProfile(user) {
  return `<div class="profile--details">
						<div class="profile--identification">
							<h2>${user.firstname}" "${user.lastname}</h2>
							<p>a Client</p>
						</div>
						<hr />
						<div class="more--details">
							<ul>
								<li>
									<span class="profile--icon"><i class="fas fa-user"></i></span>
									<div>activated</div>
								</li>
								<li>
									<span class="profile--icon"><i class="fas fa-envelope-open-text"></i></span>
									<div>johhtabbot@outlook.com</div>
								</li>
							</ul>
						</div>
						<hr />
						<div class="accounts--container">
							<div class="accounts">
								<div class="panel panel-default card-input">
									<div class="panel-heading">Account</div>
									<div class="panel-body">
										Account No -
										<br />
										Balance -
									</div>
								</div>
							</div>
							<div class="account--button">
								<button type="button" class="btn btn--primary">Create Account</button>
							</div>
						</div>
						<hr />
						<div class="additional--details">
							<p>Date of Joining: 17th March, 2019</p>
						</div>
					</div>`;
}