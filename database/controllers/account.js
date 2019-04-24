const account = require('../models/account');
const user = require('./user');

const accountController = {
  returnAllAccounts: () => new Promise((resolve, reject) => {
    account.findAll()
      .then((data) => {
        const output = data.map(accountData => ({
          createdOn: accountData.createdon,
          accountNumber: accountData.accountnumber,
          ownerEmail: accountData.email,
          type: accountData.type,
          status: accountData.status,
          balance: accountData.balance,
        }));
        resolve(Object.assign({}, { status: 200, data: output }));
      })
      .catch(error => reject(Object.assign({}, { status: 404, error })));
  }),

  getUserAccounts: accountNumber => new Promise((resolve, reject) => {
    account.findOneByAccountNo(accountNumber)
      .then((data) => {
        const output = data.map(accountData => ({
          createdOn: accountData.createdon,
          accountNumber: accountData.accountnumber,
          ownerEmail: accountData.email,
          type: accountData.type,
          status: accountData.status,
          balance: accountData.balance,
        }));
        resolve(Object.assign({}, { status: 200, data: output }));
      })
      .catch(error => reject(Object.assign({}, { status: 404, error })));
  }),

  getUserAccountsByEmail: email => new Promise((resolve, reject) => {
    account.findAllAccountsByEmail(email)
      .then((data) => {
        const output = data.map(accountData => ({
          createdOn: accountData.createdon,
          accountNumber: accountData.accountnumber,
          ownerEmail: accountData.email,
          type: accountData.type,
          status: accountData.status,
          balance: accountData.balance,
        }));
        resolve(Object.assign({}, { status: 200, data: output }));
      })
      .catch(error => reject(Object.assign({}, { status: 404, error })));
  }),

  getAccountsByStatus: status => new Promise((resolve, reject) => {
    account.findByStatus(status)
      .then((data) => {
        const output = data.map(accountData => ({
          createdOn: accountData.createdon,
          accountNumber: accountData.accountnumber,
          ownerEmail: accountData.email,
          type: accountData.type,
          status: accountData.status,
          balance: accountData.balance,
        }));
        resolve(Object.assign({}, { status: 200, data: output }));
      })
      .catch(error => reject(Object.assign({}, { status: 404, error })));
  }),

  createBankAccount: payload => new Promise((resolve, reject) => {
    let userAccount = '';
    user.findUserById(payload.owner)
      .then((userPayload) => {
        userAccount = userPayload.data;
        if (userAccount.length === 0) {
          throw Object.assign({}, {}, { status: 400, error: 'You cannot create account for user that does not exist' });
        }
        const updatedPayload = {
          id: '',
          accountNumber: '',
          createdOn: '',
          owner: userAccount[0].id,
          type: payload.type,
          status: payload.status,
          balance: 0.00,
        };
        return account.create(updatedPayload);
      })
      .then((accountPayload) => {
        const clientPayload = {
          id: accountPayload.id,
          accountNumber: accountPayload.accountNumber,
          firstName: userAccount[0].firstname,
          lastName: userAccount[0].lastname,
          email: userAccount[0].email,
          type: accountPayload.type,
          status: accountPayload.status,
          openingBalance: accountPayload.balance,
        };
        resolve(clientPayload);
      })
      .catch(err => reject(err));
  }),

  patchBankAccount: payload => new Promise((resolve, reject) => {
    const { accountNumber } = payload;
    const updatePayload = payload;
    delete updatePayload.accountNumber;
    account.update(accountNumber, updatePayload).then((patched) => {
      if (patched.length !== 0) resolve({ accountNumber, ...payload });
    }).catch(error => reject(error));
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
