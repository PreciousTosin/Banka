const { List, Map } = require('immutable');
const Decimal = require('decimal.js');
const transactionData = require('../../data/transaction');
const account = require('../controllers/account');

const transactionSchema = {
  id: 'number',
  createdOn: 'date',
  type: 'string',
  accountNumber: 'number',
  cashier: 'number',
  amount: 'number',
  oldBalance: 'number',
  newBalance: 'number',
};

class Transaction {
  static makeTransactionId() {
    let text = '';
    const possible = '0123456789';
    for (let i = 0; i < 20; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return Number(text);
  }

  static returnCurrentDateTime() {
    return new Date(Date.now());
  }

  /**
   * class constructor
   * @param {object} schema
   * @param {object} defaultTransactions
   */
  constructor(schema, defaultTransactions) {
    this.schema = schema;
    this.transactions = defaultTransactions;
  }

  /**
   *
   * @returns {object} reflection object
   */
  create(payload, accountInformation) {
    return new Promise((resolve) => {
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
        id: Transaction.makeTransactionId(),
        createdOn: Transaction.returnCurrentDateTime(),
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
      this.transactions = this.transactions.concat(List([updatedTransaction]));
      resolve(updatedTransaction);
    });
  }

  /**
   *
   * @param {Number} id
   * @returns {object} reflection object
   */
  findOneById(id) {
    return Promise.resolve(this.transactions.filter(transaction => transaction.get('id') === Number(id)).get(0));
  }

  /**
   * @returns {object} returns all reflections
   */
  findAll() {
    return new Promise((resolve) => {
      resolve(this.transactions);
    });
  }
}

module.exports = new Transaction(transactionSchema, transactionData);
