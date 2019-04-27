"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('immutable'),
    List = _require.List,
    fromJS = _require.fromJS;

var userData = require('../data/user');

var _require2 = require('../../utilities/password'),
    asyncHashPassword = _require2.asyncHashPassword;

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

var User =
/*#__PURE__*/
function () {
  _createClass(User, null, [{
    key: "makeId",
    value: function makeId() {
      var text = '';
      var possible = '0123456789';

      for (var i = 0; i < 15; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return Number(text);
    }
  }, {
    key: "generatePayload",
    value: function generatePayload(user) {
      return user["delete"]('password').toObject();
    }
  }, {
    key: "hashPassword",
    value: function hashPassword(data) {
      return new Promise(function (resolve, reject) {
        return asyncHashPassword(data.get('password')).then(function (hash) {
          return resolve(hash);
        })["catch"](function (error) {
          return reject(error);
        });
      });
    }
    /**
     * class constructor
     * @param {object} defaultUsers
     */

  }]);

  function User(schema, defaultUsers) {
    _classCallCheck(this, User);

    this.schema = schema;
    this.users = defaultUsers;
  }
  /**
   *
   * @returns {object} reflection object
   */


  _createClass(User, [{
    key: "create",
    value: function create(data) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        User.hashPassword(data).then(function (hash) {
          var newObj = fromJS({
            id: User.makeId(),
            password: hash
          });
          var updatedUser = data.merge(newObj); // update id and password

          var newUserArray = List([updatedUser]); // create list from user map

          _this.users = _this.users.concat(newUserArray); // update global user state

          resolve(updatedUser);
        })["catch"](function (error) {
          return reject(error);
        });
      });
    }
    /**
     *
     * @param {uuid} id
     * @returns {object} reflection object
     */

  }, {
    key: "findOneById",
    value: function findOneById(id) {
      return Promise.resolve(this.users.filter(function (user) {
        return user.get('id') === Number(id);
      }).get(0));
    }
    /**
     *
     * @param email
     * @returns {object} reflection object
     */

  }, {
    key: "findOneByEmail",
    value: function findOneByEmail(email) {
      return Promise.resolve(this.users.filter(function (user) {
        return user.get('email') === email;
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
        resolve(_this2.users);
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
        var patched = _this3.users.map(function (userObj) {
          if (userObj.get('id') === Number(payload.get('id'))) {
            return userObj.reduce(function (map, value, key) {
              if (payload.has(key)) {
                switch (_this3.schema[key]) {
                  case 'number':
                    return map.set(key, Number(payload.get(key)));

                  case 'boolean':
                    return map.set(key, payload.get(key) === 'true');

                  default:
                    return map.set(key, payload.get(key));
                }
              }

              return map;
            }, userObj);
          }

          return userObj;
        });

        _this3.users = patched;
        resolve(patched);
      });
    }
    /**
     * @param {string} id
     */

  }, {
    key: "delete",
    value: function _delete(id) {
      var _this4 = this;

      return new Promise(function (resolve) {
        var deletedUser = '';

        _this4.users.forEach(function (user, index) {
          if (user.get('id') === Number(id)) {
            _this4.users = _this4.users["delete"](index);
            deletedUser = user;
          } else if (user.get('email') === id) {
            _this4.users = _this4.users["delete"](index);
            deletedUser = user;
          }
        });

        resolve(deletedUser);
      });
    }
  }]);

  return User;
}();

module.exports = new User(userSchema, userData);