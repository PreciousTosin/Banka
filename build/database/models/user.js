"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _password = _interopRequireDefault(require("../../utilities/password"));

var _query = _interopRequireDefault(require("../query"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var asyncHashPassword = _password["default"].asyncHashPassword;
var userSchema = {
  id: 'number',
  email: 'string',
  firstName: 'string',
  lastName: 'string',
  password: 'string',
  type: 'string',
  isAdmin: 'boolean',
  status: 'string'
};

var hashPassword = function hashPassword(data) {
  return new Promise(function (resolve, reject) {
    return asyncHashPassword(data.password).then(function (hash) {
      return resolve(hash);
    })["catch"](function (error) {
      return reject(error);
    });
  });
};

var makeId = function makeId() {
  var text = '';
  var possible = '0123456789';

  for (var i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return Number(text);
};

var User =
/*#__PURE__*/
function () {
  function User() {
    _classCallCheck(this, User);
  }

  _createClass(User, null, [{
    key: "create",
    value: function create(data) {
      var payload = data;
      return new Promise(function (resolve, reject) {
        hashPassword(data).then(function (hash) {
          payload.id = makeId();
          payload.password = hash;
          var queryText = "INSERT INTO users(id, email, firstName, lastName, password, type, isAdmin, status)\n            VALUES($1, $2, $3, $4, $5, $6, $7, $8);";
          var params = Object.values(payload);
          return _query["default"].query(queryText, params);
        }).then(function (results) {
          if (results.rowCount === 1) {
            resolve(payload);
          }

          resolve();
        })["catch"](function (error) {
          if (error.message) reject(error.message);
          reject(error);
        });
      });
    }
  }, {
    key: "findOneById",
    value: function findOneById(id) {
      return new Promise(function (resolve, reject) {
        var queryText = "SELECT * FROM Users WHERE id=".concat(id, ";");

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: "findOneByEmail",
    value: function findOneByEmail(email) {
      return new Promise(function (resolve, reject) {
        var queryText = "SELECT * FROM Users WHERE email='".concat(email, "';");

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "findAll",
    value: function findAll() {
      return new Promise(function (resolve, reject) {
        var queryText = 'SELECT * FROM Users;';

        _query["default"].query(queryText).then(function (res) {
          resolve(res.rows);
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "update",
    value: function update(id, payload) {
      var userPayload = '';
      var parameter = Object.keys(payload)[0];
      var value = Object.values(payload)[0];
      var queryText = '';

      switch (userSchema[parameter]) {
        case 'string':
          queryText = "UPDATE Users SET ".concat(parameter, "='").concat(value, "' WHERE id = ").concat(id, ";");
          break;

        default:
          queryText = "UPDATE Users SET ".concat(parameter, "=").concat(value, " WHERE id = ").concat(id, ";");
      }

      return new Promise(function (resolve, reject) {
        _query["default"].query(queryText).then(function (res) {
          if (res.rowCount === 1) {
            return _query["default"].query("SELECT * FROM Users WHERE id=".concat(id, ";"));
          }

          return reject(Object.assign({}, {
            error: 'Update not carried out. Record may not exist'
          }));
        }).then(function (res) {
          userPayload = res.rows;
          if (userPayload.length !== 0) delete userPayload[0].password;
          resolve(userPayload);
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var userPayload = '';
      return new Promise(function (resolve, reject) {
        var queryText = "DELETE FROM Users WHERE id=".concat(id, ";");

        _query["default"].query("SELECT * FROM Users WHERE id=".concat(id, ";")).then(function (res) {
          userPayload = res.rows;
          if (userPayload.length !== 0) delete userPayload[0].password;
          return _query["default"].query(queryText);
        }).then(function (res) {
          if (res.rowCount === 1) {
            resolve(userPayload);
          }

          resolve();
        })["catch"](function (e) {
          reject(e);
        });
      });
    }
  }]);

  return User;
}();

var _default = User;
exports["default"] = _default;