"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _check = _interopRequireDefault(require("express-validator/check"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var body = _check["default"].body,
    check = _check["default"].check;

var ValidateUser =
/*#__PURE__*/
function () {
  function ValidateUser() {
    _classCallCheck(this, ValidateUser);
  }

  _createClass(ValidateUser, null, [{
    key: "checkCreateUser",
    value: function checkCreateUser() {
      return [body('firstName', 'First Name cannot be blank').exists().isAlpha().withMessage('First Name must include only alphabets'), body('lastName', 'Last Name cannot be blank').exists().isAlpha().withMessage('Last Name must include only alphabets'), body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'), body('password', 'Password cannot be blank').exists().isLength({
        min: 8
      }).withMessage('Minimum Password length is 8').matches('[0-9a-zA-Z]').withMessage('Invalid Password')];
    }
  }, {
    key: "checkCreateAdmin",
    value: function checkCreateAdmin() {
      return [body('firstName', 'First Name cannot be blank').exists().isAlpha().withMessage('First Name must include only alphabets'), body('lastName', 'Last Name cannot be blank').exists().isAlpha().withMessage('Last Name must include only alphabets'), body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'), body('password', 'Password cannot be blank').exists().isLength({
        min: 8
      }).withMessage('Minimum Password length is 8').matches('[0-9a-zA-Z]').withMessage('Invalid Password'), body('type', 'User type cannot be blank').exists().isIn(['client', 'staff']).withMessage('Invalid type. User type must either be client or staff'), body('isAdmin', 'isAdmin cannot be blank').exists().isBoolean().withMessage('Invalid value. isAdmin must either be true or false')];
    }
  }, {
    key: "checkLoginUser",
    value: function checkLoginUser() {
      return [body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'), body('password', 'Password cannot be blank').exists().matches('[0-9a-zA-Z]').withMessage('Invalid Password')];
    }
  }, {
    key: "checkUpdateUser",
    value: function checkUpdateUser() {
      return [body('firstName', 'First Name must include only alphabets').optional().isAlpha().withMessage('First Name must include only alphabets'), body('lastName', 'Last Name cannot be blank').optional().isAlpha().withMessage('Last Name must include only alphabets'), body('email', 'Email cannot be blank').optional().isEmail().withMessage('Invalid email'), body('password', 'Password cannot be blank').optional().isLength({
        min: 8
      }).withMessage('Minimum Password length is 8').matches('[0-9a-zA-Z]').withMessage('Invalid Password'), body('type', 'Invalid type. User type must either be client or staff').optional().isIn(['client', 'staff']), body('isAdmin', 'Invalid value. isAdmin must either be true or false').optional().isBoolean()];
    }
  }, {
    key: "checkForgotPassword",
    value: function checkForgotPassword() {
      return [body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email')];
    }
  }, {
    key: "checkResetPassword",
    value: function checkResetPassword() {
      return [check('token', 'Token is required').exists(), body('password', 'Password is required').exists().isLength({
        min: 6
      }).withMessage('Password must contain at least 6 characters').isLength({
        max: 20
      }).withMessage('Password can contain max 20 characters'), body('confirmPassword').custom(function (value, _ref) {
        var req = _ref.req;

        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }

        return true;
      })];
    }
  }]);

  return ValidateUser;
}();

var _default = ValidateUser;
exports["default"] = _default;