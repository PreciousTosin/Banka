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

var ValidateTransaction =
/*#__PURE__*/
function () {
  function ValidateTransaction() {
    _classCallCheck(this, ValidateTransaction);
  }

  _createClass(ValidateTransaction, null, [{
    key: "checkCreateTransaction",
    value: function checkCreateTransaction() {
      return [body('amount', 'Invalid amount. Amount cannot be blank').exists().isInt().withMessage('Invalid amount. Amount must be a number')];
    }
  }]);

  return ValidateTransaction;
}();

var _default = ValidateTransaction;
exports["default"] = _default;