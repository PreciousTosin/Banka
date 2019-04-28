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

var body = _check["default"].body;

var ValidateAccount =
/*#__PURE__*/
function () {
  function ValidateAccount() {
    _classCallCheck(this, ValidateAccount);
  }

  _createClass(ValidateAccount, null, [{
    key: "checkCreateAccount",
    value: function checkCreateAccount() {
      return [body('type', 'Invalid type. Type must be either savings or current').isIn(['savings', 'current'])];
    }
  }, {
    key: "checkUpdateAccount",
    value: function checkUpdateAccount() {
      return [body('status', 'Invalid status. Status must either be active or dormant').optional().isIn(['active', 'dormant'])];
    }
  }]);

  return ValidateAccount;
}();

var _default = ValidateAccount;
exports["default"] = _default;