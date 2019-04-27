"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _query = _interopRequireDefault(require("../query"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var accountSchema = {
  id: 'number',
  accountNumber: 'number',
  createdOn: 'date',
  owner: 'number',
  type: 'string',
  status: 'string',
  balance: 'number'
};

var makeAccountId = function makeAccountId() {
  var text = '';
  var possible = '0123456789';

  for (var i = 0; i < 7; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return Number(text);
};

var makeAccountNumber = function makeAccountNumber() {
  var text = '';
  var possible = '0123456789';

  for (var i = 0; i < 7; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return Number("28".concat(text));
};

var Account =
/*#__PURE__*/
function () {
  function Account() {
    _classCallCheck(this, Account);
  }

  _createClass(Account, null, [{
    key: "create",
    value: function create(data) {
      var payload = data;
      payload.id = makeAccountId();
      payload.accountNumber = makeAccountNumber();
      payload.createdOn = new Date(Date.now());
      return new Promise(function (resolve, reject) {
        var queryText = "INSERT INTO accounts(id, accountNumber, createdOn, owner, type, status, balance)\n            VALUES($1, $2, $3, $4, $5, $6, $7);";
        var params = Object.values(payload);

        _query["default"].query(queryText, params).then(function (results) {
          if (results.rowCount === 1) {
            resolve(payload);
          }

          resolve();
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "findOneById",
    value: function findOneById(id) {
      return new Promise(function (resolve, reject) {
        var queryText = "SELECT * FROM Accounts WHERE id=".concat(id, ";");

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: "findOneByAccountNo",
    value: function findOneByAccountNo(accountNumber) {
      return new Promise(function (resolve, reject) {
        var queryText = "SELECT\n          Accounts.id, accountNumber, createdOn, email, Accounts.type, Accounts.status, balance\n        FROM Accounts\n        LEFT JOIN Users\n        ON Users.id = Accounts.owner WHERE accountNumber=".concat(accountNumber, ";");

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: "findByStatus",
    value: function findByStatus(status) {
      return new Promise(function (resolve, reject) {
        var queryText = "SELECT\n          Accounts.id, accountNumber, createdOn, email, Accounts.type, Accounts.status, balance\n        FROM Accounts\n        LEFT JOIN Users\n        ON Users.id = Accounts.owner\n        WHERE Accounts.status='".concat(status, "';");

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
        var queryText = "SELECT\n          Accounts.id, accountNumber, createdOn, email, Accounts.type, Accounts.status, balance\n        FROM Accounts\n        LEFT JOIN Users\n        ON Users.id = Accounts.owner;";

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "findAllAccountsByEmail",
    value: function findAllAccountsByEmail(email) {
      return new Promise(function (resolve, reject) {
        // const queryText = 'SELECT * FROM Users;';
        var queryText = "SELECT\n          Accounts.id, accountNumber, createdOn, email, Accounts.type, Accounts.status, balance\n        FROM Accounts\n        LEFT JOIN Users\n        ON Users.id = Accounts.owner WHERE Users.email='".concat(email, "';");

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "update",
    value: function update(accountNumber, payload) {
      var accountPayload = '';
      var parameter = Object.keys(payload)[0];
      var value = Object.values(payload)[0];
      var queryText = '';

      switch (accountSchema[parameter]) {
        case 'string':
          queryText = "UPDATE Accounts SET ".concat(parameter, "='").concat(value, "' WHERE accountNumber = ").concat(accountNumber, ";");
          break;

        default:
          queryText = "UPDATE Accounts SET ".concat(parameter, "=").concat(value, " WHERE accountNumber = ").concat(accountNumber, ";");
      }

      return new Promise(function (resolve, reject) {
        _query["default"].query(queryText).then(function (res) {
          if (res.rowCount === 1) {
            return _query["default"].query("SELECT * FROM Accounts WHERE accountNumber=".concat(accountNumber, ";"));
          }

          return reject(Object.assign({}, {
            error: 'Update not carried out. Record may not exist'
          }));
        }).then(function (res) {
          accountPayload = res.rows;
          resolve(accountPayload);
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(accountNumber) {
      var accountPayload = '';
      return new Promise(function (resolve, reject) {
        var queryText = "DELETE FROM Accounts WHERE accountNumber=".concat(accountNumber, ";");

        _query["default"].query("SELECT * FROM Accounts WHERE accountNumber=".concat(accountNumber, ";")).then(function (res) {
          accountPayload = res.rows;
          return _query["default"].query(queryText);
        }).then(function (res) {
          if (res.rowCount === 1) {
            resolve(accountPayload);
          }

          resolve();
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }]);

  return Account;
}();

var _default = Account;
exports["default"] = _default;