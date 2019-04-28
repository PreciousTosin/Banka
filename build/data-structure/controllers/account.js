"use strict";

var _require = require('immutable'),
    Map = _require.Map;

var account = require('../models/accounts');

var user = require('./user');

var accountController = {
  returnAllAccounts: function returnAllAccounts() {
    return new Promise(function (resolve) {
      account.findAll().then(function (data) {
        return resolve(data);
      });
    });
  },
  getUserAccounts: function getUserAccounts(accountNumber) {
    return new Promise(function (resolve) {
      account.findOneById(accountNumber).then(function (data) {
        return resolve(data);
      });
    });
  },
  createBankAccount: function createBankAccount(payload) {
    return new Promise(function (resolve, reject) {
      user.findUserById(payload.owner).then(function (userPayload) {
        if (userPayload === undefined) {
          throw Object.assign({}, {}, {
            status: 400,
            error: 'You cannot create account for user that does not exist'
          });
        }

        account.create(payload, userPayload).then(function (createdAccount) {
          resolve(createdAccount);
        })["catch"](function (error) {
          return error;
        });
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  patchBankAccount: function patchBankAccount(payload) {
    return new Promise(function (resolve, reject) {
      var patchPayload = Map(payload);
      account.update(patchPayload).then(function (patched) {
        if (patched.length === 0 || Object.keys(patchPayload).length === 0) {
          reject(Object.assign({}, {
            status: 400,
            error: 'Account not found'
          }));
        }

        resolve(patchPayload);
      })["catch"](function (error) {
        return error;
      });
    });
  },
  deleteBankAccount: function deleteBankAccount(accountNumber) {
    return new Promise(function (resolve, reject) {
      account["delete"](accountNumber).then(function (deletedAccount) {
        if (deletedAccount !== '') {
          resolve(Object.assign({}, {
            status: 200,
            message: 'Account successfully deleted'
          }));
        } else {
          reject(Object.assign({}, {
            status: 400,
            error: 'Account not found'
          }));
        }
      })["catch"](function (error) {
        return error;
      });
    });
  }
};
module.exports = accountController;