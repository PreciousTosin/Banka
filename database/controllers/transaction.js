const transaction = require('../models/transaction');
const account = require('./account');


const transactionController = {
  returnAllTransations: () => new Promise((resolve, reject) => transaction.findAll()
    .then(data => resolve(Object.assign({}, { status: 200, data })))
    .catch(error => reject(Object.assign({}, { status: 404, error })))),

  getOneTransaction: id => new Promise((resolve, reject) => transaction.findOneById(id)
    .then(data => resolve(Object.assign({}, { status: 200, data })))
    .catch(error => reject(Object.assign({}, { status: 404, error })))),

  createTransaction: async (payload) => {
    try {
      const accountInformation = await account.getUserAccounts(payload.accountNumber);
      const updatedTransaction = await transaction.create(payload, accountInformation);
      const clientPayload = {
        transactionId: updatedTransaction.id,
        accountNumber: String(updatedTransaction.accountnumber),
        amount: payload.amount,
        cashier: Number(payload.cashier),
        transactionType: payload.type,
        accountBalance: String(updatedTransaction.balance),
      };
      return Object.assign({}, { status: 200, data: clientPayload });
    } catch (e) {
      if (e.message) throw new Error(e.message);
      throw new Error(e);
    }
  },
};

module.exports = transactionController;
