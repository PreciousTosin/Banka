class ManageUserTableModel extends TableModel {
  static dateTime(offset) {
    return new Date(Date.now() + offset);
  }
  constructor() {
    super();
    this.tableHeader = [ 'Id', 'email', 'FirstName', 'LastName', 'Type', 'IsAdmin', 'Status'];
    this.tableData = [
      {
        id: 3695665,
        email: '',
        firstName: 'John',
        lastName: 'Wayne',
        type: 'staff',
        IsAdmin: false,
        status: 'active',
      }, {
        id: 6589756,
        firstName: 'James',
        lastName: 'Donovan',
        type: 'client',
        IsAdmin: false,
        status: 'active',
      }, {
        id: 5487555,
        firstName: 'Tyler',
        lastName: 'Ross',
        type: 'staff',
        IsAdmin: true,
        status: 'active',
      }, {
        id: 2356897,
        firstName: 'Micheal',
        lastName: 'Flannigan',
        type: 'client',
        IsAdmin: false,
        status: 'inactive',
      },
    ];
    this.tableType = 'manage-users';
    this.loadTableEvent = new Event(this);
    this.modifyUserEvent = new Event(this);
    this.addUserEvent = new Event(this);
    this.toggleSpinnerEvent = new Event(this);
  }

  getTableData() {
    const token = localStorage.getItem('token');
    const usersUrl ='https://bankar.herokuapp.com/api/v1/auth/users';
    const bearer = 'Bearer ' + token;
    const headers = {
      'Authorization': bearer,
      'Content-Type': 'application/json',
    };

    this.toggleSpinnerEvent.notify();

    fetch(usersUrl, {
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

  createUser(payload) {
    // const { data, index } = payload;
    // const newData = this.tableData.push(data);
    const token = localStorage.getItem('token');
    const signUpUrl ='https://bankar.herokuapp.com/api/v1/auth/signup';
    const bearer = 'Bearer ' + token;
    const headers = {
      'Authorization': bearer,
      'Content-Type': 'application/json',
    };

    this.toggleSpinnerEvent.notify();

    fetch(signUpUrl, {
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (response.status === 404 || response.status === 400 || response.status === 409) {
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
    // this.addUserEvent.notify({});
  }

  modifyUser(tableData, payload) {
    console.log('ACTIVATE OR DEACTIVATE USER: ', payload, tableData);
    const { data } = tableData;
    const token = localStorage.getItem('token');
    const usersUrl =`https://bankar.herokuapp.com/api/v1/auth/users/${data.id}`;
    const bearer = 'Bearer ' + token;
    const headers = {
      'Authorization': bearer,
      'Content-Type': 'application/json',
    };

    this.toggleSpinnerEvent.notify();

    fetch(usersUrl, {
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
    // this.modifyUserEvent.notify(payload);
  }
}