const { Map } = require('immutable');
const account = require('../models/accounts');
const user = require('./user');

const accountController = {
  returnAllAccounts: () => new Promise((resolve) => {
    account.findAll().then(data => resolve(data));
  }),

  getUserAccounts: accountNumber => new Promise((resolve) => {
    account.findOneById(accountNumber).then(data => resolve(data));
  }),

  createBankAccount: payload => new Promise((resolve, reject) => {
    user.findUserById(payload.owner)
      .then((userPayload) => {
        if (userPayload === undefined) {
          throw Object.assign({}, {}, { status: 400, error: 'You cannot create account for user that does not exist' });
        }
        account.create(payload, userPayload).then((createdAccount) => {
          resolve(createdAccount);
        }).catch(error => error);
      })
      .catch(err => reject(err));
  }),

  patchBankAccount: payload => new Promise((resolve, reject) => {
    const patchPayload = Map(payload);
    account.update(patchPayload).then((patched) => {
      if (patched.length === 0 || Object.keys(patchPayload).length === 0) {
        reject(Object.assign({}, { status: 400, error: 'Account not found' }));
      }
      resolve(patchPayload);
    }).catch(error => error);
  }),

  deleteBankAccount: accountNumber => new Promise((resolve, reject) => {
    account.delete(accountNumber).then((deletedAccount) => {
      if (deletedAccount !== '') {
        resolve(Object.assign({}, { status: 200, message: 'Account successfully deleted' }));
      } else {
        reject(Object.assign({}, { status: 400, error: 'Account not found' }));
      }
    }).catch(error => error);
  }),
};

module.exports = accountController;
