class AdminTableModel extends TableModel {
  static dateTime(offset) {
    return new Date(Date.now() + offset);
  }
  constructor() {
    super();
    this.tableHeader = [ 'id', 'createdOn', 'accountNumber', 'owner', 'type', 'status', 'balance' ];
    this.tableData = [
      {
        id: 58769874154475111,
        createdOn: AdminTableModel.dateTime(0),
        accountNumber: 2816408925,
        owner: 23568974210520,
        type: 'savings',
        status: 'active',
        balance: 500.00,
      }, {
        id: 37091127128041553,
        createdOn: AdminTableModel.dateTime(24 * 60 * 60 * 1000),
        accountNumber: 2869502843,
        owner: 65897567145632,
        type: 'current',
        status: 'draft',
        balance: 1000.00,
      },
    ];
    this.tableType = 'manage-accounts';
    this.loadTableEvent = new Event(this);
    this.deleteAccountEvent = new Event(this);
    this.modifyAccountEvent = new Event(this);
    this.toggleSpinnerEvent = new Event(this);
  }

  getTableData() {
    const token = localStorage.getItem('token');
    const accountsUrl ='https://bankar.herokuapp.com/api/v1/accounts';
    const bearer = 'Bearer ' + token;
    const headers = {
      'Authorization': bearer,
      'Content-Type': 'application/json',
    };

    this.toggleSpinnerEvent.notify();

    fetch(accountsUrl, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: { ...headers },
    })
      .then((response) => {
        if (response.status === 404 || response.status === 400 || response.status === 409 || response.status === 401) {
          response.json().then((object) => {
            console.log(object.error);
            this.toggleSpinnerEvent.notify();
          })
        } else if (response.status === 200) {
          response.json().then((object) => {
            console.log('success', object);
            this.toggleSpinnerEvent.notify();
            this.loadTable(object.data);
          })
        }
      })
    // return this.tableData;
  }

  setTableData(data) {
    this.tableData = data;
  }

  loadTable(data) {
    console.log('TABLE TO BE SET: ', data);
    this.setTableData(data);
    this.loadTableEvent.notify();
  }

  deleteAccount(payload) {
    const { data, index } = payload;
    const token = localStorage.getItem('token');
    const accountsUrl =`https://bankar.herokuapp.com/api/v1/accounts/${data.accountNumber}`;
    const bearer = 'Bearer ' + token;
    const headers = {
      'Authorization': bearer,
      'Content-Type': 'application/json',
    };

    this.toggleSpinnerEvent.notify();

    fetch(accountsUrl, {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: { ...headers },
    })
      .then((response) => {
        if (response.status === 404 || response.status === 400 || response.status === 409 || response.status === 401) {
          response.json().then((object) => {
            console.log(object.error);
            this.toggleSpinnerEvent.notify();
          })
        } else if (response.status === 200) {
          response.json().then((object) => {
            console.log('success', object);
            this.toggleSpinnerEvent.notify();
            // delete table row from model and send notification to view to remove table row from html
            this.tableData = this.tableData.filter(account => account.accountNumber !== data.accountNumber);
            this.deleteAccountEvent.notify({ msg: 'account-deleted', row: index, table: this.tableType });
          })
        }
      });
  }

  modifyAccount(tableData, payload) {
    console.log('ACTIVATE OR DEACTIVATE: ', payload, tableData);
    const { data } = tableData;
    const token = localStorage.getItem('token');
    const accountsUrl =`https://bankar.herokuapp.com/api/v1/accounts/${data.accountNumber}`;
    const bearer = 'Bearer ' + token;
    const headers = {
      'Authorization': bearer,
      'Content-Type': 'application/json',
    };

    this.toggleSpinnerEvent.notify();

    fetch(accountsUrl, {
      method: 'PATCH',
      withCredentials: true,
      credentials: 'include',
      headers: { ...headers },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (response.status === 404 || response.status === 400 || response.status === 409 || response.status === 401) {
          response.json().then((object) => {
            console.log(object.error);
            this.toggleSpinnerEvent.notify();
          })
        } else if (response.status === 200) {
          response.json().then((object) => {
            console.log('success', object);
            this.toggleSpinnerEvent.notify();
            // reload table
            this.getTableData();
          })
        }
      });
    // this.modifyAccountEvent.notify(payload);
  }
}