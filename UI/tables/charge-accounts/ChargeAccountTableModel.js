class ChargeTableModel extends TableModel {
  static dateTime(offset) {
    return new Date(Date.now() + offset);
  }
  constructor() {
    super();
    this.tableHeader = [ 'id', 'createdOn', 'accountNumber', 'owner', 'type', 'status', 'balance' ];
    this.tableData = [
      {
        id: 58769874154475111,
        createdOn: ChargeTableModel.dateTime(0),
        accountNumber: 2816408925,
        owner: 23568974210520,
        type: 'savings',
        status: 'active',
        balance: 500.00,
      }, {
        id: 37091127128041553,
        createdOn: ChargeTableModel.dateTime(24 * 60 * 60 * 1000),
        accountNumber: 2869502843,
        owner: 65897567145632,
        type: 'current',
        status: 'draft',
        balance: 1000.00,
      },
    ];
    this.tableType = 'charge-accounts';
    this.loadTableEvent = new Event(this);
    this.chargeAccountEvent = new Event(this);
    this.toggleSpinnerEvent = new Event(this);
    this.toggleErrorEvent = new Event(this);
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
            this.toggleErrorEvent.notify(object.error);
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

  chargeAccount(tableData, payload) {
    // console.log('CHARGED ACCOUNT: ', payload);
    // const { data, index } = payload;
    console.log('CHARGING ACCOUNT: ', payload, tableData);
    const { data } = tableData;
    const token = localStorage.getItem('token');
    const txUrl = payload.type === 'credit'
      ? `https://bankar.herokuapp.com/api/v1/transactions/${data.accountNumber}/credit`
      : `https://bankar.herokuapp.com/api/v1/transactions/${data.accountNumber}/debit`;
    const bearer = 'Bearer ' + token;
    const headers = {
      'Authorization': bearer,
      'Content-Type': 'application/json',
    };
    const body = {
      amount: payload.amount
    };

    this.toggleSpinnerEvent.notify();

    fetch(txUrl, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: { ...headers },
      body: JSON.stringify(body)
    })
      .then((response) => {
        if (response.status === 404 || response.status === 400 || response.status === 409 || response.status === 401) {
          response.json().then((object) => {
            console.log(object.error);
            this.toggleSpinnerEvent.notify();
            this.toggleErrorEvent.notify(object.error);
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
    // this.chargeAccountEvent.notify();
  }
}