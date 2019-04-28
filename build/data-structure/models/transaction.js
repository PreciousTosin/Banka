"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('immutable'),
    List = _require.List,
    Map = _require.Map;

var Decimal = require('decimal.js');

var transactionData = require('../data/transaction');

var account = require('../controllers/account');

var transactionSchema = {
  id: 'number',
  createdOn: 'date',
  type: 'string',
  accountNumber: 'number',
  cashier: 'number',
  amount: 'number',
  oldBalance: 'number',
  newBalance: 'number'
};

var Transaction =
/*#__PURE__*/
function () {
  _createClass(Transaction, null, [{
    key: "makeTransactionId",
    value: function makeTransactionId() {
      var text = '';
      var possible = '0123456789';

      for (var i = 0; i < 20; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return Number(text);
    }
  }, {
    key: "returnCurrentDateTime",
    value: function returnCurrentDateTime() {
      return new Date(Date.now());
    }
    /**
     * class constructor
     * @param {object} schema
     * @param {object} defaultTransactions
     */

  }]);

  function Transaction(schema, defaultTransactions) {
    _classCallCheck(this, Transaction);

    this.schema = schema;
    this.transactions = defaultTransactions;
  }
  /**
   *
   * @returns {object} reflection object
   */


  _createClass(Transaction, [{
    key: "create",
    value: function create(payload, accountInformation) {
      var _this = this;

      return new Promise(function (resolve) {
        var oldBalance = new Decimal(accountInformation.get('balance'));
        var newBalance = 0;
        var mappedPayload = Map(payload);

        if (payload.type === 'credit') {
          // const accountInformation = await account.getUserAccounts(payload.accountNumber);
          newBalance = Number(oldBalance.add(payload.amount).toFixed(2));
        } else if (Number(oldBalance) < Number(payload.amount)) {
          throw Object({}, {
            error: 'balance is insufficient'
          });
        } else {
          newBalance = Number(oldBalance.minus(payload.amount).toFixed(2));
        } // transaction payload update


        var update = {
          id: Transaction.makeTransactionId(),
          createdOn: Transaction.returnCurrentDateTime(),
          oldBalance: Number(oldBalance.toFixed(2)),
          newBalance: newBalance
        }; // create transaction map

        var updatedTransaction = mappedPayload.reduce(function (map, value, key) {
          if (update[key]) return map.set(key, update[key]);
          return map;
        }, mappedPayload); // UPDATE ACCOUNT BALANCE

        account.patchBankAccount({
          accountNumber: payload.accountNumber,
          balance: newBalance
        });
        _this.transactions = _this.transactions.concat(List([updatedTransaction]));
        resolve(updatedTransaction);
      });
    }
    /**
     *
     * @param {Number} id
     * @returns {object} reflection object
     */

  }, {
    key: "findOneById",
    value: function findOneById(id) {
      return Promise.resolve(this.transactions.filter(function (transaction) {
        return transaction.get('id') === Number(id);
      }).get(0));
    }
    /**
     * @returns {object} returns all reflections
     */

  }, {
    key: "findAll",
    value: function findAll() {
      var _this2 = this;

      return new Promise(function (resolve) {
        resolve(_this2.transactions);
      });
    }
  }]);

  return Transaction;
}();

module.exports = new Transaction(transactionSchema, transactionData);