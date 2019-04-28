"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var transaction = require('../models/transaction');

var account = require('./account');

var transactionController = {
  returnAllTransations: function returnAllTransations() {
    return new Promise(function (resolve) {
      transaction.findAll().then(function (data) {
        return resolve(data);
      });
    });
  },
  getOneTransaction: function getOneTransaction(id) {
    return new Promise(function (resolve) {
      transaction.findOneById(id).then(function (data) {
        return resolve(data);
      });
    });
  },
  createTransaction: function () {
    var _createTransaction = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(payload) {
      var accountInformation, updatedTransaction;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return account.getUserAccounts(payload.accountNumber);

            case 3:
              accountInformation = _context.sent;
              _context.next = 6;
              return transaction.create(payload, accountInformation);

            case 6:
              updatedTransaction = _context.sent;
              return _context.abrupt("return", {
                transactionId: updatedTransaction.get('id'),
                accountNumber: String(updatedTransaction.get('accountNumber')),
                amount: updatedTransaction.get('amount'),
                cashier: updatedTransaction.get('cashier'),
                transactionType: updatedTransaction.get('type'),
                accountBalance: String(updatedTransaction.get('newBalance'))
              });

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", _context.t0);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 10]]);
    }));

    function createTransaction(_x) {
      return _createTransaction.apply(this, arguments);
    }

    return createTransaction;
  }()
};
module.exports = transactionController;