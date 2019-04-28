"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _check = _interopRequireDefault(require("express-validator/check"));

var _transaction = _interopRequireDefault(require("../models/transaction"));

var _account = _interopRequireDefault(require("../models/account"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var validationResult = _check["default"].validationResult;

var TransactionController =
/*#__PURE__*/
function () {
  function TransactionController() {
    _classCallCheck(this, TransactionController);
  }

  _createClass(TransactionController, null, [{
    key: "returnAllTransations",
    value: function returnAllTransations(req, res) {
      return new Promise(function (resolve, reject) {
        return _transaction["default"].findAll().then(function (data) {
          var response = Object.assign({}, {
            status: 200,
            data: data
          });
          resolve(res.status(200).json(response));
        })["catch"](function (error) {
          var errResponse = Object.assign({}, {
            status: 404,
            error: error
          });
          reject(res.status(400).json(errResponse));
        });
      });
    }
  }, {
    key: "getOneTransaction",
    value: function getOneTransaction(req, res) {
      var id = req.params.id;
      return new Promise(function (resolve) {
        return _transaction["default"].findOneById(id).then(function (data) {
          if (data.length === 0) throw new Error('Transaction(s) not found');
          var clientPayload = data.map(function (tx) {
            return {
              transactionId: tx.id,
              createdOn: tx.createdon,
              type: tx.type,
              accountNumber: tx.accountnumber,
              amount: tx.amount,
              oldBalance: tx.oldbalance,
              newBalance: tx.newbalance
            };
          });
          resolve();
          var response = Object.assign({}, {
            status: 200,
            data: clientPayload
          });
          resolve(res.status(200).json(response));
        })["catch"](function (error) {
          var errResponse = error.message ? Object.assign({}, {
            status: 404,
            error: error.message
          }) : Object.assign({}, {
            status: 404,
            error: error
          });
          resolve(res.status(errResponse.status).json(errResponse));
        });
      });
    }
  }, {
    key: "getTransactionByAccount",
    value: function getTransactionByAccount(req, res) {
      var accountNumber = req.params.accountNumber;
      return new Promise(function (resolve) {
        return _transaction["default"].findAllByAccount(accountNumber).then(function (data) {
          if (data.length === 0) throw new Error('Transaction(s) not found');
          var response = data.map(function (tx) {
            return {
              transactionId: tx.id,
              createdOn: tx.createdon,
              type: tx.type,
              accountNumber: tx.accountnumber,
              amount: tx.amount,
              oldBalance: tx.oldbalance,
              newBalance: tx.newbalance
            };
          });
          resolve(res.status(200).json(Object.assign({}, {
            status: 200,
            data: response
          })));
        })["catch"](function (error) {
          if (error.message) {
            resolve(res.status(404).json(Object.assign({}, {
              status: 404,
              error: error.message
            })));
            return;
          }

          resolve(res.status(404).json(Object.assign({}, {
            status: 404,
            error: error
          })));
        });
      });
    }
  }, {
    key: "createTransaction",
    value: function () {
      var _createTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var errors, errorList, errString, amount, accountNumber, cashierData, type, payload, accountInformation, updatedTransaction, clientPayload, response, errResponse;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                // check for validation errors
                errors = validationResult(req); // remove duplicate messages

                errorList = new Set(errors.array().map(function (e) {
                  return e.msg;
                }));

                if (errors.isEmpty()) {
                  _context.next = 7;
                  break;
                }

                errString = [];
                errorList.forEach(function (err) {
                  return errString.push(err);
                });
                return _context.abrupt("return", res.status(422).json({
                  status: 422,
                  error: errString.join(', ')
                }));

              case 7:
                amount = req.body.amount;
                accountNumber = req.params.accountNumber;
                cashierData = req.authData; // extract type from url

                type = req.url.split('/')[2];
                payload = {
                  id: '',
                  createdOn: '',
                  type: type,
                  accountNumber: Number(accountNumber),
                  cashier: Number(cashierData.id),
                  amount: Number(amount),
                  oldBalance: 0,
                  newBalance: 0
                };
                _context.next = 14;
                return _account["default"].findOneByAccountNo(payload.accountNumber);

              case 14:
                accountInformation = _context.sent;

                if (!(accountInformation.length === 0)) {
                  _context.next = 17;
                  break;
                }

                return _context.abrupt("return", res.status(404).json(Object.assign({}, {
                  status: 404,
                  error: 'Account does not exist'
                })));

              case 17:
                _context.next = 19;
                return _transaction["default"].create(payload, accountInformation);

              case 19:
                updatedTransaction = _context.sent;
                clientPayload = {
                  transactionId: updatedTransaction[0].id,
                  accountNumber: String(updatedTransaction[0].accountNumber),
                  amount: payload.amount,
                  cashier: Number(payload.cashier),
                  transactionType: payload.type,
                  accountBalance: String(updatedTransaction[1][0].balance)
                };
                response = Object.assign({}, {
                  status: 200,
                  data: clientPayload
                });
                return _context.abrupt("return", res.status(200).json(response));

              case 25:
                _context.prev = 25;
                _context.t0 = _context["catch"](0);
                errResponse = _context.t0.message ? Object.assign({}, {
                  status: 400,
                  error: _context.t0.message
                }) : Object.assign({}, {
                  status: 400,
                  error: _context.t0
                });
                return _context.abrupt("return", res.status(400).json(errResponse));

              case 29:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 25]]);
      }));

      function createTransaction(_x, _x2) {
        return _createTransaction.apply(this, arguments);
      }

      return createTransaction;
    }()
  }, {
    key: "deleteTransaction",
    value: function deleteTransaction(req, res) {
      var id = req.params.id;
      return new Promise(function (resolve) {
        _transaction["default"]["delete"](id).then(function (deletedTransaction) {
          if (deletedTransaction !== undefined) {
            var response = Object.assign({}, {
              status: 200,
              message: 'Transaction successfully deleted'
            });
            resolve(res.status(response.status).json(response));
          } else {
            var _response = Object.assign({}, {
              status: 400,
              error: 'Transaction does not exist'
            });

            resolve(res.status(_response.status).json(_response));
          }
        })["catch"](function (error) {
          var errResponse = Object.assign({}, {
            status: 400,
            error: error
          });
          resolve(res.status(400).json(errResponse));
        });
      });
    }
  }]);

  return TransactionController;
}();

var _default = TransactionController;
exports["default"] = _default;