// import Debug from 'debug';
import expressValidator from 'express-validator/check';
import account from '../models/account';
import user from '../models/user';

// const debug = Debug('development');
const { validationResult } = expressValidator;

class AccountController {
  static returnAllAccounts(req, res) {
    const findFunc = req.query.status ? account.findByStatus : account.findAll;
    return new Promise((resolve, reject) => findFunc(req.query.status)
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
      .catch(error => reject(res.status(400).json(Object.assign({}, { status: 404, error })))));
  }

  static getUserAccounts(req, res) {
    const { accountNumber } = req.params;
    return new Promise(resolve => account
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
        resolve(res.status(200).json(Object.assign({}, { status: 200, data: output })));
      })
      .catch((error) => {
        if (error.message) {
          const message = Object.assign({}, { status: 404, error: error.message });
          resolve(res.status(404).json(message));
          return;
        }
        resolve(res.status(404).json(Object.assign({}, { status: 404, error })));
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

  static createBankAccount(req, res) {
    return new Promise((resolve, reject) => {
      const errors = validationResult(req);
      // remove duplicate messages
      const errorList = errors.array().map(e => e.msg);
      if (!errors.isEmpty()) {
        resolve(res.status(422).json({ status: 422, error: errorList.join(', ') }));
        return;
      }

      const userAuthData = req.authData;
      const { type } = req.body;
      let userAccount = '';
      user.findOneById(Number(userAuthData.id))
        .then((userPayload) => {
          userAccount = userPayload;
          if (userAccount.length === 0) {
            throw Object.assign({}, {}, { status: 400, error: 'You cannot create account for user that does not exist' });
          }
          const updatedPayload = {
            id: '',
            accountNumber: '',
            createdOn: '',
            owner: userAccount[0].id,
            type,
            status: 'draft',
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
          const response = Object.assign({}, { status: 200, data: clientPayload });
          resolve(res.status(200).json(response));
        })
        .catch((err) => {
          const errorResponse = err.message ? Object.assign({}, { status: 400, error: err.message })
            : Object.assign({}, { status: 400, error: err });
          reject(res.status(400).json(errorResponse));
        });
    });
  }

  static patchBankAccount(req, res) {
    return new Promise((resolve, reject) => {
      const { accountNumber } = req.params;
      // check for validation errors
      const errors = validationResult(req);
      // remove duplicate messages
      const errorList = new Set(errors.array().map(e => e.msg));
      if (!errors.isEmpty()) {
        const errString = [];
        errorList.forEach(err => errString.push(err));
        resolve(res.status(422).json({ status: 422, error: errString.join(', ') }));
        return;
      }

      if (Object.keys(req.body).length === 0) {
        const errorResponse = Object.assign({}, { status: 400, error: 'Invalid request. You supplied no fields' });
        resolve(res.status(400).json(errorResponse));
        return;
      }

      if (Object.keys(req.body).length > 1) {
        const errorResponse = Object.assign({}, { status: 400, error: 'You can update the account status only' });
        resolve(res.status(400).json(errorResponse));
        return;
      }
      const payload = {
        accountNumber: Number(accountNumber),
        ...req.body,
      };
      const updatePayload = payload;
      delete updatePayload.accountNumber;
      account.update(accountNumber, updatePayload).then((patched) => {
        if (patched.length !== 0) {
          const response = Object.assign({}, { status: 200, data: { accountNumber, ...payload } });
          resolve(res.status(response.status).json(response));
        }
      }).catch((error) => {
        const errorResponse = Object.assign({}, { status: 400, error });
        reject(res.status(400).json(errorResponse));
      });
    });
  }

  static deleteBankAccount(req, res) {
    const { accountNumber } = req.params;
    return new Promise(resolve => account.delete(accountNumber)
      .then((deletedAccount) => {
        let response = '';
        if (deletedAccount !== undefined) {
          response = Object.assign({}, { status: 200, message: 'Account successfully deleted' });
          resolve(res.status(response.status).json(response));
        } else {
          response = Object.assign({}, { status: 400, error: 'Account does not exist' });
          resolve(res.status(response.status).json(response));
        }
      }).catch((error) => {
        const errorResponse = Object.assign({}, { status: 400, error });
        resolve(res.status(errorResponse.status).json(errorResponse));
      }));
  }
}


export default AccountController;
