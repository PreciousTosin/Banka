/** ------------------------- HTML TEMPLATES ------------------------------ */

/* ---------- detailed account profile ------------- */
const displayDetailedData = data => (
	`<h3 class="text-center">Detailed Record</h3>
		<div class="detailed-records-container">
		<div class="profile--body">
			<div class="profile--image">
				<div class="image--container">
					<img src="../img/profile-avatar.jpg" alt="profile_image">
				</div>
			</div>
			<div class="profile--details">
				<div class="profile--identification">
					<h2>${data[1]}</h2>
					<p>a Client</p>
				</div>
				<hr />
				<div class="more--details">
					<ul>
						<li>
							<span class="profile--icon">Status:</span>
							<div>activated</div>
						</li>
						<li>
							<span class="profile--icon">Account Number:</span>
							<div>${data[2]}</div>
						</li>
						<li>
							<span class="profile--icon">Account Balance:</span>
							<div>${data[3]}</div>
						</li>
					</ul>
				</div>
				<hr />
				<div class="additional--details">
					<p>Date created: ${data[4]}</p>
				</div>
			</div>
		</div>
	</div>
	`);

/* --------------- CREATE STAFF USER FORM ------------- */
function createStaffUserForm() {
	return (
		`<div class="create-user-form">
		<div class="form--header">
			<h3>Create Staff Account</h3>
		</div>
		<form id="createStaffUserForm" action="" method="POST" name="createStaffUserForm">
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
/* ------ Bank accounts management admin template ------ */
function bankAccountsAdminTemplate() {
	return (`
			<div class="gen--table">
			<table id="recordsTable">
				<thead>
					<tr class="table--row head">
						<th class="table--column column1">Id</th>
						<th class="table--column">Acc/Name</th>
						<th class="table--column">Acc/No</th>
						<th class="table--column">Balance</th>
						<th class="table--column">Date</th>
						<th class="table--column">Delete</th>
					</tr>
				</thead>
				<tbody>
					<tr class="table--row">
						<td class="table--column column1">36956655716265</td>
						<td class="table--column">John Wayne</td>
						<td class="table--column">0187925874</td>
						<td class="table--column">100000</td>
						<td class="table--column">2019-03-10</td>
						<td class="table--column"></td>
					</tr>
					<tr class="table--row">
						<td class="table--column column1">65897567145632</td>
						<td class="table--column">James Donovan</td>
						<td class="table--column">0151370846</td>
						<td class="table--column">50000</td>
						<td class="table--column">2019-03-01</td>
						<td class="table--column"></td>
					</tr>
					<tr class="table--row">
						<td class="table--column column1">54875558726968</td>
						<td class="table--column">Tyler Ross</td>
						<td class="table--column">2147378033</td>
						<td class="table--column">250000</td>
						<td class="table--column">2019-02-25</td>
						<td class="table--column"></td>
					</tr>
					<tr class="table--row">
						<td class="table--column column1">23568974210520</td>
						<td class="table--column">Micheal Flannigan</td>
						<td class="table--column">4594440081</td>
						<td class="table--column">200000</td>
						<td class="table--column">2019-02-10</td>
						<td class="table--column"></td>
					</tr>  
				</tbody>
			</table>
		</div>
	`);
}

function manageUsersTableTemplate() {
	return (
		`<div class="gen--table">
			<table id="manageUserRecordsTable">
				<thead>
					<tr class="table--row head">
						<th class="table--column column1">Id</th>
						<th class="table--column">First Name</th>
						<th class="table--column">Last Name</th>
						<th class="table--column">Type</th>
						<th class="table--column">IsAdmin</th>
						<th class="table--column">Status</th>
						<th class="table--column">Created</th>
						<th class="table--column">Modify</th>
					</tr>
				</thead>
				<tbody>
					<tr class="table--row">
						<td class="table--column column1">36956655716265</td>
						<td class="table--column">John</td>
						<td class="table--column">Wayne</td>
						<td class="table--column">staff</td>
						<td class="table--column">false</td>
						<td class="table--column">active</td>
						<td class="table--column">2019-03-10</td>
						<td class="table--column"></td>
					</tr>
					<tr class="table--row">
						<td class="table--column column1">65897567145632</td>
						<td class="table--column">James</td>
						<td class="table--column">Donovan</td>
						<td class="table--column">client</td>
						<td class="table--column">false</td>
						<td class="table--column">active</td>
						<td class="table--column">2019-03-01</td>
						<td class="table--column"></td>
					</tr>
					<tr class="table--row">
						<td class="table--column column1">54875558726968</td>
						<td class="table--column">Tyler</td>
						<td class="table--column">Ross</td>
						<td class="table--column">staff</td>
						<td class="table--column">true</td>
						<td class="table--column">active</td>
						<td class="table--column">2019-02-25</td>
						<td class="table--column"></td>
					</tr>
					<tr class="table--row">
						<td class="table--column column1">23568974210520</td>
						<td class="table--column">Micheal</td>
						<td class="table--column">Flannigan</td>
						<td class="table--column">client</td>
						<td class="table--column">false</td>
						<td class="table--column">inactive</td>
						<td class="table--column">2019-02-10</td>
						<td class="table--column"></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>`
	);
}


	/** ----------------------------------- CUSTOM DIALOGS --------------------------------- */
(function createViewDialog() {
		if (!alertify.viewDialog) {
			// define a new dialog
			alertify.dialog('viewDialog', function() {
				return ({
					main(message) {
						this.message = message;
					},
					setup() {
						return {
							buttons: [{ text: 'Close!', className: 'btn btn-primary', key: 27/* Esc */ }],
							focus: { element: 0 },
							options: {
								maximizable: true,
								closableByDimmer: false,
								resizable: false,
								transition: 'fade',
							},
						};
					},
					prepare() {
						this.setContent(this.message);
						this.setHeader('');
					},
					hooks: {
						onshow() {
							this.elements.dialog.style.maxWidth = 'none';
							this.elements.dialog.style.width = '70%';
							// this.elements.dialog.style.height = '50%';
						},
					},
				})
			});
		}
}());

(function createFormDialog() {
  if (!alertify.formDialog) {
    alertify.dialog('formDialog', function() {
			return ({
				main(content) {
					this.setContent(content);
				},
				setup() {
					return {
						focus: {
							element() {
								return this.elements.body.querySelector(this.get('selector'));
							},
							select: true,
						},
						options: {
							basic: true,
							maximizable: false,
							resizable: false,
							padding: false,
						},
					};
				},
				settings: {
					selector: undefined,
				},
			})
		});
  }
}());

//* -------------------------- EVENTS FOR THE BUTTONS ------------------------------ */
const deleteRecordEvent = (callback) => {
  $('#recordsTable').on('click', 'td.delete--btn', (event) => {
		// const obj = $(`#${event.target.id}`);
		console.log('EVENT TARGET: ', event.currentTarget);
		const target = event.currentTarget;
    callback(target);
  });
};

/* -------------- EVENTS FOR FORM SUBMISSIONS ------------- */

const createStaffUserDataEvent = () => {
  $('body').on('submit', '#createStaffUserForm', (event) => {
		event.preventDefault();
		const formData = $("#createStaffUserForm").serializeArray(); // GET FORM DATA
		console.log('STAFF USER FORM DATA', formData);
  });
};

/* ----- EVENT FOR TOGGLING ACTIVE CLASS FOR DASHBOARD TABS ----- */
function addTabsEvent() {
	$('body').on('click', '.admin--header ul li', function() {
		$('ul li.active').removeClass('active');
		$(this).closest('li').addClass('active');
	});
}

/** ------------------------------ TABLE INITIALIZATION LOGIC -----------------------------------------  */
function initializeTable() {
	let recordTable = $('#recordsTable').DataTable({
		columns: [
			null,
			null,
			null,
			null,
			null,
			{
				className: 'delete--btn',
				orderable: false,
				data: null,
				width: '5%',
			},
		],
		lengthChange: false,
		select: {
			style: 'single',
		},
		dom: 'Bfrtip',
		buttons: [
			{
				text: 'View Record',
				action() {
					console.log('VIEW BUTTON CLICKED');
					const rowData = recordTable.row('.selected').data();
					if (rowData === undefined) {
						alertify.error('Select a row to view record');
					} else {
						// console.log('TABLE DATA: ', rowData);
						alertify.viewDialog(displayDetailedData(rowData));
					}
				},
			},
		],
		columnDefs: [
			{
				targets: -1,
				data: null,
				defaultContent: '<button id="delete-btn" class="delete--btn btn btn--danger">Delete</button>',
			},
		],
		initComplete() {
			/* recordTable.buttons().container()
				.appendTo($('.col-md-6:eq(0)', recordTable.table().container())); */
		},
	});

	return recordTable;
}

function initializeUserManagementTable() {
	let recordTable = $('#manageUserRecordsTable').DataTable({
		columns: [
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			{
				className: 'manage--btn',
				orderable: false,
				/* data: null, */
				width: '5%',
			},
		],
		lengthChange: false,
		select: {
			style: 'single',
		},
		dom: 'Bfrtip',
		buttons: [
			{
				text: 'Create Account',
				action() {
					console.log('CREATE ACCOUNT BUTTON CLICKED');
					alertify.formDialog(createStaffUserForm());
				},
			},
		],
		columnDefs: [
			{
				targets: -1,
				data: function (row, type, value, meta) {
					// console.log('RowType', type);
					// console.log('DataRow', row);
					// return row[5];
					if (row[5] === 'active') {
						return '<button id="deactivate-btn" class="deactivate--btn btn btn--danger">Deactivate</button>'
					} else {
						return '<button id="activate-btn" class="activate--btn btn btn--success">Activate</button>'
					}
					// return row.status;
				},
				/* defaultContent: '<button id="debit-btn" class="debit--btn btn btn--danger">Manage</button>', */
			},
		],
		initComplete() {
			/* recordTable.buttons().container()
				.appendTo($('.col-md-6:eq(0)', recordTable.table().container())); */
		},
	});

	return recordTable;
}

/** ---------------- Record Operations ----------------------- */
const deleteRecord = (data, target) => {
	const rowData = data.row($(target).parents('tr')).data();
	console.log('DATA TO DELETE: ', rowData);
}

/** --------------- Initialize default admin page ------------------ */
function findandSetAdminHtml() {
	const bankRecordsTemplate = bankAccountsAdminTemplate();
	const container = document.querySelector('.admin--body');
	container.innerHTML = bankRecordsTemplate;
}

function initializeDefaultAdmin() {
	findandSetAdminHtml();
	const table = initializeTable();
	deleteRecordEvent((target) => deleteRecord(table, target));
}

/** --------------- Initialize Manage users page ------------------ */
function findandSetManageHtml() {
	const template = manageUsersTableTemplate();
	const container = document.querySelector('.admin--body');
	container.innerHTML = template;
} 

function initializeManageUsersAdmin() {
	findandSetManageHtml();
	const table = initializeUserManagementTable();
	createStaffUserDataEvent();
}

/** ---------------- Initialize admin dashboard -------------------------------- */
window.onload = function() {
	// createViewDialog();
	addTabsEvent();
	initializeDefaultAdmin();
	// initializeConsumateAdmin();
	// initializeManageUsersAdmin();
}