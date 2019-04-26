import account from '../models/account';
import user from './user';

class AccountController {
  static returnAllAccounts() {
    return new Promise((resolve, reject) => account.findAll()
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
      .catch(error => reject(Object.assign({}, { status: 404, error }))));
  }

  static getUserAccounts(accountNumber) {
    return new Promise((resolve, reject) => account
      .findOneByAccountNo(accountNumber)
      .then((data) => {
        if (data.length === 0) throw new Error('Account does not exist');
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
      .catch((error) => {
        if (error.message) reject(Object.assign({}, { status: 404, error: error.message }));
        reject(Object.assign({}, { status: 404, error }));
      }));
  }

  static getUserAccountsByEmail(req, res) {
    const { email } = req.params;
    return new Promise((resolve, reject) => account.findAllAccountsByEmail(email)
      .then((data) => {
        const output = data.map(accountData => ({
          createdOn: accountData.createdon,
          accountNumber: accountData.accountnumber,
          ownerEmail: accountData.email,
          type: accountData.type,
          status: accountData.status,
          balance: accountData.balance,
        }));
        resolve(res.status(200).json(Object.assign({}, { status: 200, data: output })));
      })
      .catch(error => reject(res.status(404).json(Object.assign({}, { status: 404, error })))));
  }

  static getAccountsByStatus(status) {
    return new Promise((resolve, reject) => account.findByStatus(status)
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
      .catch(error => reject(Object.assign({}, { status: 404, error }))));
  }

  static createBankAccount(payload) {
    return new Promise((resolve, reject) => {
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
    });
  }

  static patchBankAccount(payload) {
    return new Promise((resolve, reject) => {
      const { accountNumber } = payload;
      const updatePayload = payload;
      delete updatePayload.accountNumber;
      account.update(accountNumber, updatePayload).then((patched) => {
        if (patched.length !== 0) resolve({ accountNumber, ...payload });
      }).catch(error => reject(error));
    });
  }

  static deleteBankAccount(accountNumber) {
    return new Promise((resolve, reject) => account.delete(accountNumber).then((deletedAccount) => {
      if (deletedAccount !== '') {
        resolve(Object.assign({}, { status: 200, message: 'Account successfully deleted' }));
      } else {
        reject(Object.assign({}, { status: 400, error: 'Account not found' }));
      }
    }).catch(error => error));
  }
}


export default AccountController;
