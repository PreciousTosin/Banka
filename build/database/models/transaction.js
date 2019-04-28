"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _decimal = _interopRequireDefault(require("decimal.js"));

var _query = _interopRequireDefault(require("../query"));

var _account = _interopRequireDefault(require("./account"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var makeTransactionId = function makeTransactionId() {
  var text = '';
  var possible = '0123456789';

  for (var i = 0; i < 6; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return Number(text);
};

var returnCurrentDateTime = function returnCurrentDateTime() {
  return new Date(Date.now());
};

var Transaction =
/*#__PURE__*/
function () {
  function Transaction() {
    _classCallCheck(this, Transaction);
  }

  _createClass(Transaction, null, [{
    key: "create",
    value: function create(payload, accountInformationRes) {
      var accountInformation = accountInformationRes[0];
      return new Promise(function (resolve, reject) {
        var oldBalance = new _decimal["default"](accountInformation.balance);
        var newBalance = 0;

        if (payload.type === 'credit') {
          newBalance = Number(oldBalance.add(payload.amount).toFixed(2));
        } else if (Number(oldBalance) < Number(payload.amount)) {
          throw new Error('Account balance is insufficient');
        } else {
          newBalance = Number(oldBalance.minus(payload.amount).toFixed(2));
        } // transaction payload update


        var update = {
          id: makeTransactionId(),
          createdOn: returnCurrentDateTime(),
          type: payload.type,
          accountNumber: accountInformation.accountnumber,
          cashier: payload.cashier,
          amount: Number(payload.amount),
          oldBalance: Number(oldBalance.toFixed(2)),
          newBalance: newBalance
        };
        var queryText = "INSERT INTO transactions(id, createdOn, type, accountNumber, cashier, amount, oldBalance, newBalance)\n            VALUES($1, $2, $3, $4, $5, $6, $7, $8);";
        var params = Object.values(update); // create transaction

        var createTransaction = function createTransaction() {
          return _query["default"].query(queryText, params);
        }; // UPDATE ACCOUNT BALANCE


        var updateAccount = function updateAccount() {
          return _account["default"].update(update.accountNumber, {
            balance: newBalance
          });
        }; // Perform atomic transaction


        _query["default"].transaction(createTransaction, updateAccount).then(function (results) {
          var createTxOperation = results[0];
          var updateAccOperation = results[1];

          if (createTxOperation.rowCount !== 1) {
            throw new Error('Transaction failed');
          }

          resolve([update, updateAccOperation]);
        })["catch"](function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: "findOneById",
    value: function findOneById(id) {
      return new Promise(function (resolve, reject) {
        var queryText = "SELECT * FROM Transactions WHERE id=".concat(id, ";");

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: "findAll",
    value: function findAll() {
      return new Promise(function (resolve, reject) {
        var queryText = 'SELECT * FROM Transactions;';

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "findAllByAccount",
    value: function findAllByAccount(accountNumber) {
      return new Promise(function (resolve, reject) {
        var queryText = "SELECT * FROM Transactions WHERE accountNumber=".concat(accountNumber, ";");

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var transactionPayload = '';
      return new Promise(function (resolve, reject) {
        var queryText = "DELETE FROM Transactions WHERE id=".concat(id, ";");

        _query["default"].query("SELECT * FROM Transactions WHERE id=".concat(id, ";")).then(function (res) {
          transactionPayload = res.rows;
          return _query["default"].query(queryText);
        }).then(function (res) {
          if (res.rowCount === 1) {
            resolve(transactionPayload);
          }

          resolve();
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }]);

  return Transaction;
}();

var _default = Transaction;
exports["default"] = _default;