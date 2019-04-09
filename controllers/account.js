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

  getUserAccounts: id => new Promise((resolve) => {
    const userAccounts = accountsModel.filter(account => account.get('id') === Number(id));
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
    const { id } = payload;
    const patchPayload = Map(payload);
    const patch = patchPayload.delete('id');
    const patchedOutput = {};
    const patched = accountsModel.map((account) => {
      if (account.get('id') === Number(id)) {
        patchedOutput.accountNumber = account.get('accountNumber'); // add account number
        return account.reduce((map, value, key) => {
          if (patch.has(key)) {
            patchedOutput[key] = patchPayload.get(key); // add key/value pairs of patched data
            return map.set(key, patch.get(key));
          }
          return map;
        }, account);
      }
      return account;
    });
    if (patched.length === 0 || Object.keys(patchedOutput).length === 0) {
      reject(Object.assign({}, { status: 400, error: 'user not found' }));
    }
    accountsModel = patched; // update global account state;
    resolve(patchedOutput);
  }),
};
