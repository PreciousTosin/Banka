const { List, Map } = require('immutable');
const accountData = require('../data/account');

const accountSchema = {
  id: 'number',
  accountNumber: 'number',
  createdOn: 'date',
  owner: 'number',
  type: 'string',
  status: 'string',
  balance: 'number',
};

class Account {
  static makeAccountId() {
    let text = '';
    const possible = '0123456789';
    for (let i = 0; i < 18; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return Number(text);
  }

  static makeAccountNumber() {
    let text = '';
    const possible = '0123456789';
    for (let i = 0; i < 8; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return Number(`28${text}`);
  }

  /**
   * class constructor
   * @param {object} schema
   * @param {object} defaultAccounts
   */
  constructor(schema, defaultAccounts) {
    this.schema = schema;
    this.accounts = defaultAccounts;
  }

  /**
   *
   * @returns {object} reflection object
   */
  create(newData, userPayload) {
    return new Promise((resolve) => {
      const updatedPayload = {
        id: Account.makeAccountId(),
        accountNumber: Account.makeAccountNumber(),
        createdOn: new Date(Date.now()),
        owner: Number(newData.owner),
        type: newData.type,
        status: newData.status,
        balance: 0.00,
      };
      const newAccount = Map(updatedPayload);
      const newAccountList = List([newAccount]);

      const clientPayload = {
        id: newAccount.get('id'),
        accountNumber: newAccount.get('accountNumber'),
        firstName: userPayload.get('firstName'),
        lastName: userPayload.get('lastName'),
        email: userPayload.get('email'),
        type: newAccount.get('type'),
        status: newAccount.get('status'),
        openingBalance: newAccount.get('balance'),
      };
      this.accounts = this.accounts.concat(newAccountList); // update accounts global state
      resolve(clientPayload);
    });
  }

  /**
   *
   * @param {Number} accountNumber
   * @returns {object} reflection object
   */
  findOneById(accountNumber) {
    return Promise.resolve(this.accounts.filter(account => account.get('accountNumber') === Number(accountNumber)).get(0));
  }

  /**
   * @returns {object} returns all reflections
   */
  findAll() {
    return new Promise((resolve) => {
      resolve(this.accounts);
    });
  }

  /**
   * @param {object} payload
   */
  update(payload) {
    return new Promise((resolve) => {
      const patched = this.accounts.map((accountObj) => {
        if (accountObj.get('accountNumber') === Number(payload.get('accountNumber'))) {
          return accountObj.reduce((map, value, key) => {
            if (payload.has(key)) {
              switch (this.schema[key]) {
                case 'number':
                  return map.set(key, Number(payload.get(key)));
                default:
                  return map.set(key, payload.get(key));
              }
            }
            return map;
          }, accountObj);
        }
        return accountObj;
      });
      this.accounts = patched;
      resolve(patched);
    });
  }

  /**
   * @param {number} accountNumber
   */
  delete(accountNumber) {
    return new Promise((resolve) => {
      let deletedAccount = '';
      this.accounts.forEach((account, index) => {
        if (account.get('accountNumber') === Number(accountNumber)) {
          this.accounts = this.accounts.delete(index);
          deletedAccount = account;
        }
      });
      resolve(deletedAccount);
    });
  }
}

module.exports = new Account(accountSchema, accountData);
