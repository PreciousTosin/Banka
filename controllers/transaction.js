const transaction = require('../models/transaction');
const account = require('../controllers/account');


const transactionController = {
  returnAllTransations: () => new Promise((resolve) => {
    transaction.findAll().then(data => resolve(data));
  }),

  getOneTransaction: id => new Promise((resolve) => {
    transaction.findOneById(id).then(data => resolve(data));
  }),

  createTransaction: async (payload) => {
    try {
      const accountInformation = await account.getUserAccounts(payload.accountNumber);
      const updatedTransaction = await transaction.create(payload, accountInformation);
      // return data payload
      return {
        transactionId: updatedTransaction.get('id'),
        accountNumber: String(updatedTransaction.get('accountNumber')),
        amount: updatedTransaction.get('amount'),
        cashier: updatedTransaction.get('cashier'),
        transactionType: updatedTransaction.get('type'),
        accountBalance: String(updatedTransaction.get('newBalance')),
      };
    } catch (e) {
      return e;
    }
  },
};

module.exports = transactionController;
