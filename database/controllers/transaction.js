const transaction = require('../models/transaction');
const account = require('./account');


const transactionController = {
  returnAllTransations: () => new Promise((resolve, reject) => transaction.findAll()
    .then(data => resolve(Object.assign({}, { status: 200, data })))
    .catch(error => reject(Object.assign({}, { status: 404, error })))),

  getOneTransaction: id => new Promise((resolve, reject) => transaction.findOneById(id)
    .then((data) => {
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
    .catch(error => reject(Object.assign({}, { status: 404, error })))),

  createTransaction: async (payload) => {
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
  },

  deleteTransaction: id => new Promise((resolve, reject) => {
    transaction.delete(id).then((deletedTransaction) => {
      if (deletedTransaction !== '') {
        resolve(Object.assign({}, { status: 200, message: 'Transaction successfully deleted' }));
      } else {
        reject(Object.assign({}, { status: 400, error: 'Transaction not found' }));
      }
    }).catch(error => error);
  }),
};

module.exports = transactionController;
