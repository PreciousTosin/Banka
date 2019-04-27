"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var TokenUtility =
/*#__PURE__*/
function () {
  function TokenUtility() {
    _classCallCheck(this, TokenUtility);
  }

  _createClass(TokenUtility, null, [{
    key: "createToken",
    value: function createToken(payload) {
      // eslint-disable-next-line no-param-reassign
      if (payload.password) delete payload.password;
      return new Promise(function (resolve, reject) {
        _jsonwebtoken["default"].sign(payload, process.env.SECRET_KEY, {
          expiresIn: 60 * 60
        }, function (err, token) {
          if (err) reject(err);
          resolve(token);
        });
      });
    }
  }, {
    key: "verifyToken",
    value: function verifyToken(token) {
      return new Promise(function (resolve, reject) {
        return _jsonwebtoken["default"].verify(token, process.env.SECRET_KEY, function (err, decoded) {
          if (err) reject(err);
          resolve(decoded);
        });
      });
    }
  }]);

  return TokenUtility;
}();

var _default = TokenUtility;
exports["default"] = _default;