"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('immutable'),
    Map = _require.Map;

var user = require('../models/user');

var _require2 = require('../../utilities/password'),
    asyncComparePassword = _require2.asyncComparePassword;

var _require3 = require('../../utilities/jwt-token'),
    createToken = _require3.createToken,
    verifyToken = _require3.verifyToken;
/* --------------- UTILITY FUNCTIONS ----------------------- */


function generatePayload(userPayload) {
  return userPayload["delete"]('password').toObject();
}

var userController = {
  returnAllUsers: function returnAllUsers() {
    return new Promise(function (resolve) {
      user.findAll().then(function (data) {
        return resolve(data);
      });
    });
  },
  findUserById: function findUserById(id) {
    return new Promise(function (resolve) {
      user.findOneById(id).then(function (data) {
        return resolve(data);
      });
    });
  },
  findUserByEmail: function findUserByEmail(email) {
    return new Promise(function (resolve) {
      user.findOneByEmail(email).then(function (data) {
        return resolve(data);
      });
    });
  },
  createUser: function createUser(payload) {
    return new Promise(function (resolve, reject) {
      var newUser = Map(payload); // check first if email exists, if it does, throw an error
      // if user does not exist, create an account

      user.findOneByEmail(payload.email).then(function (foundUser) {
        if (foundUser !== undefined) throw Object.assign({}, {}, {
          status: 409,
          error: 'User exists'
        });
        user.create(newUser).then(function (userCreated) {
          createToken(generatePayload(userCreated)).then(function (token) {
            var tokenizedUser = userCreated.set('token', token); // add token

            var clientPayload = tokenizedUser["delete"]('password'); // remove password key/value

            resolve(clientPayload);
          })["catch"](function (error) {
            return error;
          });
        })["catch"](function (error) {
          return error;
        });
      })["catch"](function (error) {
        return reject(error);
      });
    });
  },
  loginUser: function () {
    var _loginUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(payload) {
      var userData, isValidUser, tokenPayload, token, tokenizedUser, clientPayload;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return user.findOneByEmail(payload.email);

            case 3:
              userData = _context.sent;

              if (!(userData === undefined)) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", Object.assign({}, {
                status: 400,
                error: 'User does not exist'
              }));

            case 6:
              _context.next = 8;
              return asyncComparePassword(payload.password, userData.get('password'));

            case 8:
              isValidUser = _context.sent;

              if (!(isValidUser === true)) {
                _context.next = 17;
                break;
              }

              tokenPayload = generatePayload(userData);
              _context.next = 13;
              return createToken(tokenPayload);

            case 13:
              token = _context.sent;
              tokenizedUser = userData.set('token', token);
              clientPayload = tokenizedUser["delete"]('password');
              return _context.abrupt("return", Object.assign({}, {
                status: 200,
                data: clientPayload
              }));

            case 17:
              return _context.abrupt("return", Object.assign({}, {
                status: 400,
                error: 'Password is incorrect'
              }));

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](0);
              console.log(_context.t0);
              return _context.abrupt("return", Object.assign({}, {
                status: 400,
                error: _context.t0
              }));

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 20]]);
    }));

    function loginUser(_x) {
      return _loginUser.apply(this, arguments);
    }

    return loginUser;
  }(),
  verifyUser: function () {
    var _verifyUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(token) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return verifyToken(token);

            case 3:
              return _context2.abrupt("return", Object.assign({}, {
                status: 200,
                message: 'token is valid'
              }));

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", Object.assign({}, {
                status: 400,
                error: _context2.t0.message
              }));

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 6]]);
    }));

    function verifyUser(_x2) {
      return _verifyUser.apply(this, arguments);
    }

    return verifyUser;
  }(),
  updateUser: function updateUser(payload) {
    return new Promise(function (resolve, reject) {
      var update = Map(payload);
      var userID = Number(update.get('id'));
      user.findOneById(userID).then(function (userData) {
        if (userData === undefined) {
          reject(Object.assign({}, {
            status: 400,
            error: 'User not found'
          }));
        }

        user.update(update).then(function (patched) {
          resolve(Object.assign({}, {
            status: 200,
            message: 'User updated successfully',
            data: patched
          }));
        })["catch"](function (error) {
          return error;
        });
      })["catch"](function (error) {
        return reject(error);
      });
    });
  },
  deleteUser: function deleteUser(id) {
    return new Promise(function (resolve, reject) {
      user["delete"](id).then(function (deletedUser) {
        if (deletedUser !== '') {
          resolve(Object.assign({}, {
            status: 200,
            message: 'User Deleted successfully',
            data: deletedUser
          }));
        } else {
          reject(Object.assign({}, {
            status: 400,
            error: 'User not found'
          }));
        }
      })["catch"](function (error) {
        return reject(error);
      });
    });
  }
};
module.exports = userController;