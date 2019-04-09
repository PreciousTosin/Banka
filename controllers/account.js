const { List, Map } = require('immutable');
let accountsModel = require('../models/accounts');
const user = require('../controllers/user');

/* --------------- UTILITY FUNCTIONS ----------------------- */
function makeAccountId() {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 18; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(text);
}

function makeAccountNumber() {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 9; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(`28${text}`);
}

module.exports = {
  returnAllAccounts: () => new Promise((resolve) => {
    resolve(accountsModel);
  }),

  getUserAccounts: accountNumber => new Promise((resolve) => {
    const userAccounts = accountsModel.filter(account => account.get('accountNumber') === Number(accountNumber)).get(0);
    resolve(userAccounts);
  }),

  createBankAccount: payload => new Promise((resolve, reject) => {
    const cleanPayload = {};
    Object.keys(payload).forEach((key) => {
      if (key === 'owner') cleanPayload.owner = Number(payload.owner);
    });
    const updatedPayload = {
      id: makeAccountId(),
      accountNumber: makeAccountNumber(),
      createdOn: new Date(Date.now()),
      ...cleanPayload,
      type: payload.type,
      status: payload.status,
      balance: 0.00,
    };
    const newAccount = Map(updatedPayload);
    const newAccountList = List([newAccount]);
    const id = newAccount.get('owner');
    user.findUserById(id)
      .then((userPayload) => {
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
        accountsModel = accountsModel.concat(newAccountList); // update accounts global state
        resolve(clientPayload);
      })
      .catch(err => reject(err));
  }),

  patchBankAccount: payload => new Promise((resolve, reject) => {
    const { accountNumber } = payload;
    const patchPayload = Map(payload);
    const patched = accountsModel.map((account) => {
      if (account.get('accountNumber') === Number(accountNumber)) {
        return account.reduce((map, value, key) => {
          if (patchPayload.has(key)) {
            return map.set(key, patchPayload.get(key));
          }
          return map;
        }, account);
      }
      return account;
    });
    if (patched.length === 0 || Object.keys(patchPayload).length === 0) {
      reject(Object.assign({}, { status: 400, error: 'user not found' }));
    }
    accountsModel = patched; // update global account state;
    resolve(patchPayload);
  }),

  deleteBankAccount: accountNumber => new Promise((resolve, reject) => {
    let deletedAccount = '';
    accountsModel.forEach((account, index) => {
      if (account.get('accountNumber') === Number(accountNumber)) {
        accountsModel = accountsModel.delete(index);
        deletedAccount = account;
      }
    });
    if (deletedAccount !== '') {
      resolve(Object.assign({}, { status: 200, message: 'Account successfully deleted' }));
    } else {
      reject(Object.assign({}, { status: 400, error: 'Account not found' }));
    }
  }),
};
