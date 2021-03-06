/* eslint-disable prefer-destructuring */
import queryDb from '../query';

const accountSchema = {
  id: 'number',
  accountNumber: 'number',
  createdOn: 'date',
  owner: 'number',
  type: 'string',
  status: 'string',
  balance: 'number',
};

const makeAccountId = () => {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 7; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(text);
};

const makeAccountNumber = () => {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 7; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(`28${text}`);
};

class Account {
  static create(data) {
    const payload = data;
    payload.id = makeAccountId();
    payload.accountNumber = makeAccountNumber();
    payload.createdOn = new Date(Date.now());
    return new Promise((resolve, reject) => {
      const queryText = `INSERT INTO accounts(id, accountNumber, createdOn, owner, type, status, balance)
            VALUES($1, $2, $3, $4, $5, $6, $7);`;
      const params = Object.values(payload);
      queryDb.query(queryText, params)
        .then((results) => {
          if (results.rowCount === 1) {
            resolve(payload);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static findOneById(id) {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT * FROM Accounts WHERE id=${id};`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findOneByAccountNo(accountNumber) {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT
          Accounts.id, accountNumber, createdOn, email, Accounts.type, Accounts.status, balance
        FROM Accounts
        LEFT JOIN Users
        ON Users.id = Accounts.owner WHERE accountNumber=${accountNumber};`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findByStatus(status) {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT
          Accounts.id, accountNumber, createdOn, email, Accounts.type, Accounts.status, balance
        FROM Accounts
        LEFT JOIN Users
        ON Users.id = Accounts.owner
        WHERE Accounts.status='${status}';`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT
          Accounts.id, accountNumber, createdOn, email, Accounts.type, Accounts.status, balance
        FROM Accounts
        LEFT JOIN Users
        ON Users.id = Accounts.owner;`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static findAllAccountsByEmail(email) {
    return new Promise((resolve, reject) => {
      // const queryText = 'SELECT * FROM Users;';
      const queryText = `SELECT
          Accounts.id, accountNumber, createdOn, email, Accounts.type, Accounts.status, balance
        FROM Accounts
        LEFT JOIN Users
        ON Users.id = Accounts.owner WHERE Users.email='${email}';`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static update(accountNumber, payload) {
    let accountPayload = '';
    const parameter = Object.keys(payload)[0];
    const value = Object.values(payload)[0];
    let queryText = '';
    switch (accountSchema[parameter]) {
      case 'string':
        queryText = `UPDATE Accounts SET ${parameter}='${value}' WHERE accountNumber = ${accountNumber};`;
        break;
      default:
        queryText = `UPDATE Accounts SET ${parameter}=${value} WHERE accountNumber = ${accountNumber};`;
    }
    return new Promise((resolve, reject) => {
      queryDb.query(queryText)
        .then((res) => {
          if (res.rowCount === 1) {
            return queryDb.query(`SELECT * FROM Accounts WHERE accountNumber=${accountNumber};`);
          }
          return reject(Object.assign({}, { error: 'Update not carried out. Record may not exist' }));
        })
        .then((res) => {
          accountPayload = res.rows;
          resolve(accountPayload);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static delete(accountNumber) {
    let accountPayload = '';
    return new Promise((resolve, reject) => {
      const queryText = `DELETE FROM Accounts WHERE accountNumber=${accountNumber};`;
      queryDb.query(`SELECT * FROM Accounts WHERE accountNumber=${accountNumber};`)
        .then((res) => {
          accountPayload = res.rows;
          return queryDb.query(queryText);
        })
        .then((res) => {
          if (res.rowCount === 1) {
            resolve(accountPayload);
          }
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

export default Account;
