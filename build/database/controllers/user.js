"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _check = _interopRequireDefault(require("express-validator/check"));

var _user = _interopRequireDefault(require("../models/user"));

var _password = _interopRequireDefault(require("../../utilities/password"));

var _jwtToken = _interopRequireDefault(require("../../utilities/jwt-token"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var asyncComparePassword = _password["default"].asyncComparePassword;
var validationResult = _check["default"].validationResult;
/* --------------- UTILITY FUNCTIONS ----------------------- */

var generateUserPrint = function generateUserPrint(userPayload, admin) {
  return {
    id: userPayload.id ? userPayload.id : userPayload.id,
    email: userPayload.email,
    firstName: userPayload.firstName ? userPayload.firstName : userPayload.firstname,
    lastName: userPayload.lastName ? userPayload.lastName : userPayload.lastname,
    password: userPayload.password,
    type: userPayload.type === 'staff' ? userPayload.type : 'client',
    isAdmin: admin === true ? admin : false,
    status: 'active'
  };
};

var tokenizeUser = function tokenizeUser(userWithoutToken) {
  return new Promise(function (resolve, reject) {
    return _jwtToken["default"].createToken(userWithoutToken).then(function (token) {
      resolve(_objectSpread({}, userWithoutToken, {
        token: token
      }));
    })["catch"](function (error) {
      return reject(error);
    });
  });
};

var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: "returnAllUsers",
    value: function returnAllUsers(req, res) {
      return new Promise(function (resolve, reject) {
        _user["default"].findAll().then(function (data) {
          return data.map(function (userData) {
            return {
              id: userData.id,
              email: userData.email,
              firstName: userData.firstname,
              lastName: userData.lastname,
              type: userData.type,
              IsAdmin: userData.isadmin,
              status: userData.status
            };
          });
        }).then(function (data) {
          return resolve(res.status(200).json(Object.assign({}, {
            status: 200,
            data: data
          })));
        })["catch"](function () {
          return reject(res.status(404).json(Object.assign({}, {
            status: 404,
            error: 'User not found'
          })));
        });
      });
    }
  }, {
    key: "findUserById",
    value: function findUserById(req, res) {
      return new Promise(function (resolve, reject) {
        var id = req.params.id;
        var regex = /@/ig;
        var isEmail = regex.test(id);

        if (isEmail === true) {
          _user["default"].findOneByEmail(id).then(function (data) {
            return resolve(res.status(200).json(Object.assign({}, {
              status: 200,
              data: data
            })));
          })["catch"](function () {
            return reject(res.status(404).json(Object.assign({}, {
              status: 404,
              error: 'User not found'
            })));
          });

          return;
        }

        _user["default"].findOneById(id).then(function (data) {
          return resolve(res.status(200).json(Object.assign({}, {
            status: 200,
            data: data
          })));
        })["catch"](function () {
          return reject(res.status(404).json(Object.assign({}, {
            status: 404,
            error: 'User not found'
          })));
        });
      });
    }
  }, {
    key: "findUserByEmail",
    value: function findUserByEmail(email) {
      return new Promise(function (resolve) {
        _user["default"].findOneByEmail(email).then(function (data) {
          return resolve(data);
        });
      });
    }
  }, {
    key: "createUser",
    value: function createUser(req, res) {
      return new Promise(function (resolve) {
        var userData = req.body; // check for validation errors

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
        } // check for admin or user url


        var urlLength = req.url.split('/').length;
        var isAdmin = urlLength === 3; // check first if email exists, if it does, throw an error
        // if user does not exist, create an account

        var userPayload = generateUserPrint(userData, isAdmin);

        _user["default"].findOneByEmail(userPayload.email).then(function (foundUser) {
          if (foundUser.length !== 0) throw Object.assign({}, {}, {
            status: 409,
            message: 'User exists'
          });
        }).then(function () {
          return _user["default"].create(userPayload);
        }).then(function (userCreated) {
          return tokenizeUser(userCreated);
        }).then(function (tokenedUser) {
          var clientPayload = tokenedUser;
          delete clientPayload.password; // remove password key/value

          var response = Object.assign({}, {
            status: 200,
            data: clientPayload
          });
          resolve(res.status(response.status).json(response));
        })["catch"](function (error) {
          var errorMsg = error;
          var resStatus = 400;

          if (error.message) {
            errorMsg = error.message;
            resStatus = error.status;
          }

          var message = {
            status: resStatus,
            error: errorMsg
          };
          resolve(res.status(resStatus).json(Object.assign({}, message)));
        });
      });
    }
  }, {
    key: "loginUser",
    value: function () {
      var _loginUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var userPayload, errors, errorList, errString, userData, errorResponse, isValidUser, tokenPayload, tokenizedUser, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                userPayload = req.body;
                errors = validationResult(req); // remove duplicate messages

                errorList = new Set(errors.array().map(function (e) {
                  return e.msg;
                }));

                if (errors.isEmpty()) {
                  _context.next = 8;
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

              case 8:
                _context.next = 10;
                return _user["default"].findOneByEmail(userPayload.email);

              case 10:
                userData = _context.sent;

                if (!(userData === undefined || userData.length === 0)) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt("return", res.status(404).json(Object.assign({}, {
                  status: 404,
                  error: 'User does not exist'
                })));

              case 13:
                if (!(userData[0].status === 'inactive')) {
                  _context.next = 16;
                  break;
                }

                errorResponse = Object.assign({}, {
                  status: 400,
                  error: 'Your account has been suspended.'
                });
                return _context.abrupt("return", res.status(400).json(errorResponse));

              case 16:
                _context.next = 18;
                return asyncComparePassword(userPayload.password, userData[0].password);

              case 18:
                isValidUser = _context.sent;

                if (!(isValidUser === true)) {
                  _context.next = 28;
                  break;
                }

                // generate user data to tokenize
                tokenPayload = generateUserPrint(userData[0], userData[0].isadmin);
                _context.next = 23;
                return _jwtToken["default"].createToken(tokenPayload);

              case 23:
                userData[0].token = _context.sent;
                tokenizedUser = userData[0];
                delete tokenizedUser.password;
                response = Object.assign({}, {
                  status: 200,
                  data: tokenizedUser
                });
                return _context.abrupt("return", res.status(response.status).json(response));

              case 28:
                return _context.abrupt("return", res.status(400).json(Object.assign({}, {
                  status: 400,
                  error: 'Password is incorrect'
                })));

              case 31:
                _context.prev = 31;
                _context.t0 = _context["catch"](0);

                if (!_context.t0.message) {
                  _context.next = 35;
                  break;
                }

                return _context.abrupt("return", res.status(400).json(Object.assign({}, {
                  status: 400,
                  error: _context.t0.message
                })));

              case 35:
                return _context.abrupt("return", res.status(400).json(Object.assign({}, {
                  status: 400,
                  error: _context.t0
                })));

              case 36:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 31]]);
      }));

      function loginUser(_x, _x2) {
        return _loginUser.apply(this, arguments);
      }

      return loginUser;
    }()
  }, {
    key: "verifyUser",
    value: function () {
      var _verifyUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(token) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _jwtToken["default"].verifyToken(token);

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

      function verifyUser(_x3) {
        return _verifyUser.apply(this, arguments);
      }

      return verifyUser;
    }()
  }, {
    key: "updateUser",
    value: function updateUser(req, res) {
      return new Promise(function (resolve) {
        if (Object.keys(req.body).length === 0) {
          resolve(res.status(400).json(Object.assign({}, {
            status: 400,
            error: 'Invalid Request, You made an empty request'
          })));
          return;
        }

        if (req.body.password) {
          var errorResponse = Object.assign({}, {
            status: 400,
            error: 'Invalid request. You cannot change user password this way'
          });
          resolve(res.status(400).json(errorResponse));
          return;
        } // check for validation errors


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

        var userPayload = _objectSpread({
          id: req.params.id
        }, req.body);

        var id = userPayload.id;
        var updatePayload = userPayload;
        delete updatePayload.id;

        _user["default"].findOneById(id).then(function (userData) {
          if (userData === undefined) {
            resolve(res.status(404).json(Object.assign({}, {
              status: 404,
              error: 'User not found'
            })));
          }
        }).then(function () {
          return _user["default"].update(id, updatePayload);
        }).then(function (patched) {
          resolve(res.status(200).json(Object.assign({}, {
            status: 200,
            message: 'User updated successfully',
            data: patched
          })));
        })["catch"](function (error) {
          return resolve(res.status(400).json(Object.assign({}, {
            status: 404,
            error: error
          })));
        });
      });
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(req, res) {
      return new Promise(function (resolve, reject) {
        var id = req.params.id;

        _user["default"]["delete"](id).then(function (deletedUser) {
          if (deletedUser !== undefined) {
            resolve(res.status(200).json(Object.assign({}, {
              status: 200,
              message: 'User Deleted successfully',
              data: deletedUser
            })));
          } else {
            reject(res.status(404).json(Object.assign({}, {
              status: 404,
              error: 'User not found'
            })));
          }
        })["catch"](function (error) {
          return reject(res.status(400).json(Object.assign({}, {
            status: 400,
            error: error
          })));
        });
      });
    }
  }]);

  return UserController;
}();

var _default = UserController;
exports["default"] = _default;