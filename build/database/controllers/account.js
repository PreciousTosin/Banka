"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _check = _interopRequireDefault(require("express-validator/check"));

var _account = _interopRequireDefault(require("../models/account"));

var _user = _interopRequireDefault(require("../models/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// const debug = Debug('development');
var validationResult = _check["default"].validationResult;

var AccountController =
/*#__PURE__*/
function () {
  function AccountController() {
    _classCallCheck(this, AccountController);
  }

  _createClass(AccountController, null, [{
    key: "returnAllAccounts",
    value: function returnAllAccounts(req, res) {
      var findFunc = req.query.status ? _account["default"].findByStatus : _account["default"].findAll;
      return new Promise(function (resolve, reject) {
        return findFunc(req.query.status).then(function (data) {
          var output = data.map(function (accountData) {
            return {
              createdOn: accountData.createdon,
              accountNumber: accountData.accountnumber,
              ownerEmail: accountData.email,
              type: accountData.type,
              status: accountData.status,
              balance: accountData.balance
            };
          });
          resolve(res.status(200).json(Object.assign({}, {
            status: 200,
            data: output
          })));
        })["catch"](function (error) {
          return reject(res.status(400).json(Object.assign({}, {
            status: 404,
            error: error
          })));
        });
      });
    }
  }, {
    key: "getUserAccounts",
    value: function getUserAccounts(req, res) {
      var accountNumber = req.params.accountNumber;
      return new Promise(function (resolve) {
        return _account["default"].findOneByAccountNo(accountNumber).then(function (data) {
          if (data.length === 0) throw new Error('Account does not exist');
          var output = data.map(function (accountData) {
            return {
              createdOn: accountData.createdon,
              accountNumber: accountData.accountnumber,
              ownerEmail: accountData.email,
              type: accountData.type,
              status: accountData.status,
              balance: accountData.balance
            };
          });
          resolve(res.status(200).json(Object.assign({}, {
            status: 200,
            data: output
          })));
        })["catch"](function (error) {
          if (error.message) {
            var message = Object.assign({}, {
              status: 404,
              error: error.message
            });
            resolve(res.status(404).json(message));
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
    key: "getUserAccountsByEmail",
    value: function getUserAccountsByEmail(req, res) {
      var email = req.params.email;
      return new Promise(function (resolve, reject) {
        return _account["default"].findAllAccountsByEmail(email).then(function (data) {
          var output = data.map(function (accountData) {
            return {
              createdOn: accountData.createdon,
              accountNumber: accountData.accountnumber,
              ownerEmail: accountData.email,
              type: accountData.type,
              status: accountData.status,
              balance: accountData.balance
            };
          });
          resolve(res.status(200).json(Object.assign({}, {
            status: 200,
            data: output
          })));
        })["catch"](function (error) {
          return reject(res.status(404).json(Object.assign({}, {
            status: 404,
            error: error
          })));
        });
      });
    }
  }, {
    key: "createBankAccount",
    value: function createBankAccount(req, res) {
      return new Promise(function (resolve, reject) {
        var errors = validationResult(req); // remove duplicate messages

        var errorList = errors.array().map(function (e) {
          return e.msg;
        });

        if (!errors.isEmpty()) {
          resolve(res.status(422).json({
            status: 422,
            error: errorList.join(', ')
          }));
          return;
        }

        var userAuthData = req.authData;
        var type = req.body.type;
        var userAccount = '';

        _user["default"].findOneById(Number(userAuthData.id)).then(function (userPayload) {
          userAccount = userPayload;

          if (userAccount.length === 0) {
            throw Object.assign({}, {}, {
              status: 400,
              error: 'You cannot create account for user that does not exist'
            });
          }

          var updatedPayload = {
            id: '',
            accountNumber: '',
            createdOn: '',
            owner: userAccount[0].id,
            type: type,
            status: 'draft',
            balance: 0.00
          };
          return _account["default"].create(updatedPayload);
        }).then(function (accountPayload) {
          var clientPayload = {
            id: accountPayload.id,
            accountNumber: accountPayload.accountNumber,
            firstName: userAccount[0].firstname,
            lastName: userAccount[0].lastname,
            email: userAccount[0].email,
            type: accountPayload.type,
            status: accountPayload.status,
            openingBalance: accountPayload.balance
          };
          var response = Object.assign({}, {
            status: 200,
            data: clientPayload
          });
          resolve(res.status(200).json(response));
        })["catch"](function (err) {
          var errorResponse = err.message ? Object.assign({}, {
            status: 400,
            error: err.message
          }) : Object.assign({}, {
            status: 400,
            error: err
          });
          reject(res.status(400).json(errorResponse));
        });
      });
    }
  }, {
    key: "patchBankAccount",
    value: function patchBankAccount(req, res) {
      return new Promise(function (resolve, reject) {
        var accountNumber = req.params.accountNumber; // check for validation errors

        var errors = validationResult(req); // remove duplicate messages

        var errorList = new Set(errors.array().map(function (e) {
          return e.msg;
        }));

        if (!errors.isEmpty()) {
          var errString = [];
          errorList.forEach(function (err) {
            return errString.push(err);
          });
          resolve(res.status(422).json({
            status: 422,
            error: errString.join(', ')
          }));
          return;
        }

        if (Object.keys(req.body).length === 0) {
          var errorResponse = Object.assign({}, {
            status: 400,
            error: 'Invalid request. You supplied no fields'
          });
          resolve(res.status(400).json(errorResponse));
          return;
        }

        if (Object.keys(req.body).length > 1) {
          var _errorResponse = Object.assign({}, {
            status: 400,
            error: 'You can update the account status only'
          });

          resolve(res.status(400).json(_errorResponse));
          return;
        }

        var payload = _objectSpread({
          accountNumber: Number(accountNumber)
        }, req.body);

        var updatePayload = payload;
        delete updatePayload.accountNumber;

        _account["default"].update(accountNumber, updatePayload).then(function (patched) {
          if (patched.length !== 0) {
            var response = Object.assign({}, {
              status: 200,
              data: _objectSpread({
                accountNumber: accountNumber
              }, payload)
            });
            resolve(res.status(response.status).json(response));
          }
        })["catch"](function (error) {
          var errorResponse = Object.assign({}, {
            status: 400,
            error: error
          });
          reject(res.status(400).json(errorResponse));
        });
      });
    }
  }, {
    key: "deleteBankAccount",
    value: function deleteBankAccount(req, res) {
      var accountNumber = req.params.accountNumber;
      return new Promise(function (resolve) {
        return _account["default"]["delete"](accountNumber).then(function (deletedAccount) {
          var response = '';

          if (deletedAccount !== undefined) {
            response = Object.assign({}, {
              status: 200,
              message: 'Account successfully deleted'
            });
            resolve(res.status(response.status).json(response));
          } else {
            response = Object.assign({}, {
              status: 400,
              error: 'Account does not exist'
            });
            resolve(res.status(response.status).json(response));
          }
        })["catch"](function (error) {
          var errorResponse = Object.assign({}, {
            status: 400,
            error: error
          });
          resolve(res.status(errorResponse.status).json(errorResponse));
        });
      });
    }
  }]);

  return AccountController;
}();

var _default = AccountController;
exports["default"] = _default;