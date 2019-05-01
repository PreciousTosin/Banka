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