const displayDetailedData = data => (
	`<h3 class="text-center">Detailed Record</h3>
		<div class="detailed-records-container">
		<div class="profile--body">
			<div class="profile--image">
				<div class="image--container">
					<img src="./img/profile-avatar.jpg" alt="profile_image">
				</div>
			</div>
			<div class="profile--details">
				<div class="profile--identification">
					<h2>John Tabbot</h2>
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
				<div class="additional--details">
					<p>Date of Joining: 17th March, 2019</p>
				</div>
			</div>
		</div>
	</div>
	`);

	/* ------------- CUSTOM DIALOG ------------- */
const createViewDialog = () => {
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
	}
//* -------------------------- EVENTS FOR THE BUTTONS ------------------------------ */
const deleteRecordEvent = (callback) => {
  $('#recordsTable').on('click', 'td.delete--btn', (event) => {
		// const obj = $(`#${event.target.id}`);
		console.log('EVENT TARGET: ', event.currentTarget);
		const target = event.currentTarget;
    callback(target);
  });
};


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
						alertify.viewDialog(displayDetailedData(rowData));
					}
				},
			},
		],
		columnDefs: [
			{
				targets: -1,
				data: null,
				defaultContent: '<button id="delete-btn" class="delete--btn btn btn-danger">Delete</button>',
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

window.onload = function() {
	createViewDialog();
	const table = initializeTable();
	deleteRecordEvent((target) => deleteRecord(table, target));
}