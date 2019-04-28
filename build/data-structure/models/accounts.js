"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('immutable'),
    List = _require.List,
    Map = _require.Map;

var accountData = require('../data/account');

var accountSchema = {
  id: 'number',
  accountNumber: 'number',
  createdOn: 'date',
  owner: 'number',
  type: 'string',
  status: 'string',
  balance: 'number'
};

var Account =
/*#__PURE__*/
function () {
  _createClass(Account, null, [{
    key: "makeAccountId",
    value: function makeAccountId() {
      var text = '';
      var possible = '0123456789';

      for (var i = 0; i < 18; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return Number(text);
    }
  }, {
    key: "makeAccountNumber",
    value: function makeAccountNumber() {
      var text = '';
      var possible = '0123456789';

      for (var i = 0; i < 8; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return Number("28".concat(text));
    }
    /**
     * class constructor
     * @param {object} schema
     * @param {object} defaultAccounts
     */

  }]);

  function Account(schema, defaultAccounts) {
    _classCallCheck(this, Account);

    this.schema = schema;
    this.accounts = defaultAccounts;
  }
  /**
   *
   * @returns {object} reflection object
   */


  _createClass(Account, [{
    key: "create",
    value: function create(newData, userPayload) {
      var _this = this;

      return new Promise(function (resolve) {
        var updatedPayload = {
          id: Account.makeAccountId(),
          accountNumber: Account.makeAccountNumber(),
          createdOn: new Date(Date.now()),
          owner: Number(newData.owner),
          type: newData.type,
          status: newData.status,
          balance: 0.00
        };
        var newAccount = Map(updatedPayload);
        var newAccountList = List([newAccount]);
        var clientPayload = {
          id: newAccount.get('id'),
          accountNumber: newAccount.get('accountNumber'),
          firstName: userPayload.get('firstName'),
          lastName: userPayload.get('lastName'),
          email: userPayload.get('email'),
          type: newAccount.get('type'),
          status: newAccount.get('status'),
          openingBalance: newAccount.get('balance')
        };
        _this.accounts = _this.accounts.concat(newAccountList); // update accounts global state

        resolve(clientPayload);
      });
    }
    /**
     *
     * @param {Number} accountNumber
     * @returns {object} reflection object
     */

  }, {
    key: "findOneById",
    value: function findOneById(accountNumber) {
      return Promise.resolve(this.accounts.filter(function (account) {
        return account.get('accountNumber') === Number(accountNumber);
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
        resolve(_this2.accounts);
      });
    }
    /**
     * @param {object} payload
     */

  }, {
    key: "update",
    value: function update(payload) {
      var _this3 = this;

      return new Promise(function (resolve) {
        var patched = _this3.accounts.map(function (accountObj) {
          if (accountObj.get('accountNumber') === Number(payload.get('accountNumber'))) {
            return accountObj.reduce(function (map, value, key) {
              if (payload.has(key)) {
                switch (_this3.schema[key]) {
                  case 'number':
                    return map.set(key, Number(payload.get(key)));

                  default:
                    return map.set(key, payload.get(key));
                }
              }

              return map;
            }, accountObj);
          }

          return accountObj;
        });

        _this3.accounts = patched;
        resolve(patched);
      });
    }
    /**
     * @param {number} accountNumber
     */

  }, {
    key: "delete",
    value: function _delete(accountNumber) {
      var _this4 = this;

      return new Promise(function (resolve) {
        var deletedAccount = '';

        _this4.accounts.forEach(function (account, index) {
          if (account.get('accountNumber') === Number(accountNumber)) {
            _this4.accounts = _this4.accounts["delete"](index);
            deletedAccount = account;
          }
        });

        resolve(deletedAccount);
      });
    }
  }]);

  return Account;
}();

module.exports = new Account(accountSchema, accountData);