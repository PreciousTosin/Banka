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
/* ---------------- CREDIT AND DEBIT FORM ------------- */
const createConsumateForm = transactionType => (
	`<div class="consumate--form dialog--form">
		<h3>Consumate ${transactionType} Transaction</h3>
		<form id="consumateForm" action="" method="POST" name="consumateForm">
		<input type="text" class="form--control" id="type" style="visibility: hidden" name="type" value="${transactionType}">
			<div class="form--group">
				<input type="text" class="form--control" id="amount" placeholder="Amount" name="amount" required>
			</div>
      <button type="submit" class="btn btn--primary">Submit</button>
    </form>
   </div>`
);
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

function consumateAdminTemplate() {
	return (
		`<div class="gen--table">
		<table id="consumateRecordsTable">
			<thead>
				<tr class="table--row head">
					<th class="table--column column1">Id</th>
					<th class="table--column">Acc/Name</th>
					<th class="table--column">Acc/No</th>
					<th class="table--column">Status</th>
					<th class="table--column">Balance</th>
					<th class="table--column">Date</th>
					<th class="table--column">Credit</th>
					<th class="table--column">Debit</th>
				</tr>
			</thead>
			<tbody>
				<tr class="table--row">
					<td class="table--column column1">36956655716265</td>
					<td class="table--column">John Wayne</td>
					<td class="table--column">0187925874</td>
					<td class="table--column">draft</td>
					<td class="table--column">100000</td>
					<td class="table--column">2019-03-10</td>
					<td class="table--column"></td>
					<td class="table--column"></td>
				</tr>
				<tr class="table--row">
					<td class="table--column column1">65897567145632</td>
					<td class="table--column">James Donovan</td>
					<td class="table--column">0151370846</td>
					<td class="table--column">active</td>
					<td class="table--column">50000</td>
					<td class="table--column">2019-03-01</td>
					<td class="table--column"></td>
					<td class="table--column"></td>
				</tr>
				<tr class="table--row">
					<td class="table--column column1">54875558726968</td>
					<td class="table--column">Tyler Ross</td>
					<td class="table--column">2147378033</td>
					<td class="table--column">draft</td>
					<td class="table--column">250000</td>
					<td class="table--column">2019-02-25</td>
					<td class="table--column"></td>
					<td class="table--column"></td>
				</tr>
				<tr class="table--row">
					<td class="table--column column1">23568974210520</td>
					<td class="table--column">Micheal Flannigan</td>
					<td class="table--column">4594440081</td>
					<td class="table--column">draft</td>
					<td class="table--column">200000</td>
					<td class="table--column">2019-02-10</td>
					<td class="table--column"></td>
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

(function createConsumateDialog() {
  if (!alertify.consumateDialog) {
    alertify.dialog('consumateDialog', function() {
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

const creditAccountEvent = (callback) => {
  $('#consumateRecordsTable').on('click', 'td.credit--btn', (event) => {
		// const obj = $(`#${event.target.id}`);
		console.log('EVENT TARGET: ', event.currentTarget);
		const target = event.currentTarget;
    callback(target);
  });
};

const debitAccountEvent = (callback) => {
  $('#consumateRecordsTable').on('click', 'td.debit--btn', (event) => {
		// const obj = $(`#${event.target.id}`);
		console.log('EVENT TARGET: ', event.currentTarget);
		const target = event.currentTarget;
    callback(target);
  });
};

/* -------------- EVENTS FOR FORM SUBMISSIONS ------------- */
const consumateDataEvent = () => {
  $('body').on('submit', '#consumateForm', (event) => {
		event.preventDefault();
		const formData = $("#consumateForm").serializeArray(); // GET FORM DATA
		if (formData[0].value === 'Credit') {
			console.log('CREDIT CONSUMATION TRANSACTION', formData);
		} else {
			console.log('DEBIT CONSUMATION TRANSACTION', formData);
		}
  });
};

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

function initializeConsumateTable() {
	let recordTable = $('#consumateRecordsTable').DataTable({
		columns: [
			null,
			null,
			null,
			null,
			null,
			null,
			{
				className: 'credit--btn',
				orderable: false,
				data: null,
				width: '5%',
			},
			{
				className: 'debit--btn',
				orderable: false,
				data: null,
				width: '5%',
			},
		],
		lengthChange: false,
		select: {
			style: 'single',
		},
		columnDefs: [
			{
				targets: -2,
				data: null,
				defaultContent: '<button id="credit-btn" class="credit--btn btn btn--primary">Credit</button>',
			},
			{
				targets: -1,
				data: null,
				defaultContent: '<button id="debit-btn" class="debit--btn btn btn--danger">Debit</button>',
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

const creditAccount = (data, target) => {
	const rowData = data.row($(target).parents('tr')).data();
	console.log('ACCOUNT TO CREDIT: ', rowData);
	alertify.consumateDialog(createConsumateForm('Credit'));
}

const debitAccount = (data, target) => {
	const rowData = data.row($(target).parents('tr')).data();
	console.log('ACCOUNT TO DEBIT: ', rowData);
	alertify.consumateDialog(createConsumateForm('Debit'));
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

/** --------------- Initialize consumate admin page ------------------ */
function findandSetConsumateHtml() {
	const bankRecordsTemplate = consumateAdminTemplate();
	const container = document.querySelector('.admin--body');
	container.innerHTML = bankRecordsTemplate;
} 

function initializeConsumateAdmin() {
	findandSetConsumateHtml();
	const table = initializeConsumateTable();
	creditAccountEvent((target) => creditAccount(table, target));
	debitAccountEvent((target) => debitAccount(table, target));
	consumateDataEvent();
}

/** ---------------- Initialize admin dashboard -------------------------------- */
window.onload = function() {
	// createViewDialog();
	initializeDefaultAdmin();
	// initializeConsumateAdmin();
}