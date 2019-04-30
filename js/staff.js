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

/* ------ Bank accounts management staff template ------ */
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

//* -------------------------- EVENTS FOR THE BUTTONS ------------------------------ */
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
				.appendTo($('.col-md-6:eq(0)', recordTable.tables().container())); */
		},
	});

	return recordTable;
}

/** ---------------- Record Operations ----------------------- */

const creditAccount = (data, target) => {
	const rowData = data.row($(target).parents('tr')).data();
	console.log('ACCOUNT TO CREDIT: ', rowData);
	alertify.formDialog(createConsumateForm('Credit'));
}

const debitAccount = (data, target) => {
	const rowData = data.row($(target).parents('tr')).data();
	console.log('ACCOUNT TO DEBIT: ', rowData);
	alertify.formDialog(createConsumateForm('Debit'));
}

/** --------------- Initialize consumate staff page ------------------ */
function findandSetConsumateHtml() {
	const bankRecordsTemplate = consumateAdminTemplate();
	const container = document.querySelector('.staff--body');
	container.innerHTML = bankRecordsTemplate;
} 

function initializeConsumateAdmin() {
	findandSetConsumateHtml();
	const table = initializeConsumateTable();
	creditAccountEvent((target) => creditAccount(table, target));
	debitAccountEvent((target) => debitAccount(table, target));
	consumateDataEvent();
}

window.onload = function() {
	initializeConsumateAdmin();
}