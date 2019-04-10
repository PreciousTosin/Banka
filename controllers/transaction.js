const { List, Map } = require('immutable');
const Decimal = require('decimal.js');
let transactionModel = require('../models/transaction');
const account = require('../controllers/account');

function makeTransactionId() {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 20; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(text);
}

function returnCurrentDateTime() {
  return new Date(Date.now());
}


module.exports = {
  returnAllTransations: () => new Promise((resolve) => {
    resolve(transactionModel);
  }),

  createTransaction: async (payload) => {
    try {
      const accountInformation = await account.getUserAccounts(payload.accountNumber);
      const oldBalance = new Decimal(accountInformation.get('balance'));
      let newBalance = 0;
      const mappedPayload = Map(payload);
      if (payload.type === 'credit') {
        // const accountInformation = await account.getUserAccounts(payload.accountNumber);
        newBalance = Number(oldBalance.add(payload.amount).toFixed(2));
      } else if (Number(oldBalance) < Number(payload.amount)) {
        throw Object({}, { error: 'balance is insufficient' });
      } else {
        newBalance = Number(oldBalance.minus(payload.amount).toFixed(2));
      }

      // transaction payload update
      const update = {
        id: makeTransactionId(),
        createdOn: returnCurrentDateTime(),
        oldBalance: Number(oldBalance.toFixed(2)),
        newBalance,
      };
      // create transaction map
      const updatedTransaction = mappedPayload.reduce((map, value, key) => {
        if (update[key]) return map.set(key, update[key]);
        return map;
      }, mappedPayload);
      // UPDATE ACCOUNT BALANCE
      account.patchBankAccount({ accountNumber: payload.accountNumber, balance: newBalance });
      transactionModel = transactionModel.concat(List([updatedTransaction]));
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
