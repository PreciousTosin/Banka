import expressValidator from 'express-validator/check';
import transaction from '../models/transaction';
import account from '../models/account';

const { validationResult } = expressValidator;

class TransactionController {
  static returnAllTransations(req, res) {
    return new Promise((resolve, reject) => transaction.findAll()
      .then((data) => {
        const response = Object.assign({}, { status: 200, data });
        resolve(res.status(200).json(response));
      })
      .catch((error) => {
        const errResponse = Object.assign({}, { status: 404, error });
        reject(res.status(400).json(errResponse));
      }));
  }

  static getOneTransaction(req, res) {
    const { id } = req.params;
    return new Promise(resolve => transaction.findOneById(id)
      .then((data) => {
        if (data.length === 0) throw new Error('Transaction(s) not found');
        const clientPayload = data.map(tx => ({
          transactionId: tx.id,
          createdOn: tx.createdon,
          type: tx.type,
          accountNumber: tx.accountnumber,
          amount: tx.amount,
          oldBalance: tx.oldbalance,
          newBalance: tx.newbalance,
        }));
        resolve();
        const response = Object.assign({}, { status: 200, data: clientPayload });
        resolve(res.status(200).json(response));
      })
      .catch((error) => {
        const errResponse = error.message ? Object.assign({}, { status: 404, error: error.message })
          : Object.assign({}, { status: 404, error });
        resolve(res.status(errResponse.status).json(errResponse));
      }));
  }

  static getTransactionByAccount(req, res) {
    const { accountNumber } = req.params;
    return new Promise(resolve => transaction
      .findAllByAccount(accountNumber)
      .then((data) => {
        if (data.length === 0) throw new Error('Transaction(s) not found');
        const response = data.map(tx => ({
          transactionId: tx.id,
          createdOn: tx.createdon,
          type: tx.type,
          accountNumber: tx.accountnumber,
          amount: tx.amount,
          oldBalance: tx.oldbalance,
          newBalance: tx.newbalance,
        }));
        resolve(res.status(200).json(Object.assign({}, { status: 200, data: response })));
      })
      .catch((error) => {
        if (error.message) {
          resolve(res.status(404).json(Object.assign({}, { status: 404, error: error.message })));
          return;
        }
        resolve(res.status(404).json(Object.assign({}, { status: 404, error })));
      }));
  }

  static async createTransaction(req, res) {
    try {
      // check for validation errors
      const errors = validationResult(req);
      // remove duplicate messages
      const errorList = new Set(errors.array().map(e => e.msg));
      if (!errors.isEmpty()) {
        const errString = [];
        errorList.forEach(err => errString.push(err));
        return res.status(422).json({ status: 422, error: errString.join(', ') });
      }

      const { amount } = req.body;
      const { accountNumber } = req.params;
      const cashierData = req.authData;
      // extract type from url
      const type = req.url.split('/')[2];
      const payload = {
        id: '',
        createdOn: '',
        type,
        accountNumber: Number(accountNumber),
        cashier: Number(cashierData.id),
        amount: Number(amount),
        oldBalance: 0,
        newBalance: 0,
      };
      const accountInformation = await account.findOneByAccountNo(payload.accountNumber);
      if (accountInformation.length === 0) {
        return res.status(404).json(Object.assign({}, { status: 404, error: 'Account does not exist' }));
      }
      const updatedTransaction = await transaction.create(payload, accountInformation);
      const clientPayload = {
        transactionId: updatedTransaction[0].id,
        accountNumber: String(updatedTransaction[0].accountNumber),
        amount: payload.amount,
        cashier: Number(payload.cashier),
        transactionType: payload.type,
        accountBalance: String(updatedTransaction[1][0].balance),
      };
      const response = Object.assign({}, { status: 200, data: clientPayload });
      return res.status(200).json(response);
    } catch (e) {
      const errResponse = e.message ? Object.assign({}, { status: 400, error: e.message })
        : Object.assign({}, { status: 400, error: e });
      return res.status(400).json(errResponse);
    }
  }

  static deleteTransaction(req, res) {
    const { id } = req.params;
    return new Promise((resolve) => {
      transaction.delete(id).then((deletedTransaction) => {
        if (deletedTransaction !== undefined) {
          const response = Object.assign({}, { status: 200, message: 'Transaction successfully deleted' });
          resolve(res.status(response.status).json(response));
        } else {
          const response = Object.assign({}, { status: 400, error: 'Transaction does not exist' });
          resolve(res.status(response.status).json(response));
        }
      }).catch((error) => {
        const errResponse = Object.assign({}, { status: 400, error });
        resolve(res.status(400).json(errResponse));
      });
    });
  }
}

export default TransactionController;
