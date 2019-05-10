function createStaffUserForm() {
  return (
    `<div class="create-user-form">
		<div class="form--header">
			<h4>Create Staff Account</h4>
		</div>
		<form id="createStaffUserForm" class="create-staff-user-form" action="" method="POST" name="createStaffUserForm">
			<div class="super--form--group">
				<div class="form--group">
					<label for="firstName">First Name</label>
					<input type="text" class="form--control" id="firstName" name="firstName" required>
				</div>
				<div class="form--group">
					<label for="lastName">Last Name</label>
					<input type="text" class="form--control" id="lastName" name="lastName" required>
				</div>
			</div>
			<div class="form--group">
				<label for="email">Email</label>
				<input type="email" class="form--control" id="email" name="email" required>
			</div>
			<div class="form--group">
				<label for="password">Password</label>
				<input type="password" class="form--control" id="password" name="password" required>
			</div>
			<div class="super--form--group">
				<div class="form--group">
					<label for="type">Type</label>
					<input type="text" class="form--control" id="type" name="type" value="staff" required>
				</div>
				<div class="form--group">
					<label for="IsAdmin">IsAdmin</label>
					<select class="form--control" id="IsAdmin" name="IsAdmin" required>
						<option value="true">True</option>
						<option value="false" selected>False</option>
					</select>
				</div>
			</div>
			<div class="submit--btn">
				<button type="submit" class="btn btn--primary">Submit</button>
			</div>
		</form>
	</div>`
  );
}