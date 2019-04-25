import transaction from '../models/transaction';
import account from './account';


class TransactionController {
  static returnAllTransations() {
    return new Promise((resolve, reject) => transaction.findAll()
      .then(data => resolve(Object.assign({}, { status: 200, data })))
      .catch(error => reject(Object.assign({}, { status: 404, error }))));
  }

  static getOneTransaction(id) {
    return new Promise((resolve, reject) => transaction.findOneById(id)
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
        resolve(Object.assign({}, { status: 200, data: response }));
      })
      .catch((error) => {
        if (error.message) reject(Object.assign({}, { status: 404, error: error.message }));
        reject(Object.assign({}, { status: 404, error }));
      }));
  }

  static getTransactionByAccount(accountNumber) {
    return new Promise((resolve, reject) => transaction
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
        resolve(Object.assign({}, { status: 200, data: response }));
      })
      .catch((error) => {
        if (error.message) reject(Object.assign({}, { status: 404, error: error.message }));
        reject(Object.assign({}, { status: 404, error }));
      }));
  }

  static async createTransaction(payload) {
    try {
      const accountInformation = await account.getUserAccounts(payload.accountNumber);
      const updatedTransaction = await transaction.create(payload, accountInformation);
      // console.log('TRANSACTION: ', accountInformation, updatedTransaction);
      const clientPayload = {
        transactionId: updatedTransaction[0].id,
        accountNumber: String(updatedTransaction[0].accountNumber),
        amount: payload.amount,
        cashier: Number(payload.cashier),
        transactionType: payload.type,
        accountBalance: String(updatedTransaction[1].balance),
      };
      // console.log('CLIENT PAYLOAD: ', clientPayload);
      return Object.assign({}, { status: 200, data: clientPayload });
    } catch (e) {
      if (e.message) throw new Error(e.message);
      throw new Error(e);
    }
  }

  static deleteTransaction(id) {
    return new Promise((resolve, reject) => {
      transaction.delete(id).then((deletedTransaction) => {
        if (deletedTransaction !== '') {
          resolve(Object.assign({}, { status: 200, message: 'Transaction successfully deleted' }));
        } else {
          reject(Object.assign({}, { status: 400, error: 'Transaction not found' }));
        }
      }).catch(error => error);
    });
  }
}

export default TransactionController;
