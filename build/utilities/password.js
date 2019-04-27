"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Password =
/*#__PURE__*/
function () {
  function Password() {
    _classCallCheck(this, Password);
  }

  _createClass(Password, null, [{
    key: "hashPassword",
    value: function hashPassword(password) {
      var salt = _bcryptjs["default"].genSaltSync(10);

      return _bcryptjs["default"].hashSync(password, salt);
    }
  }, {
    key: "comparePassword",
    value: function comparePassword(password, hash) {
      return _bcryptjs["default"].compareSync(password, hash);
    }
  }, {
    key: "asyncHashPassword",
    value: function asyncHashPassword(password) {
      return new Promise(function (resolve, reject) {
        _bcryptjs["default"].genSalt(10, function (err, salt) {
          if (err) reject(err);

          _bcryptjs["default"].hash(password, salt, function (error, hash) {
            if (error) reject(error);
            resolve(hash);
          });
        });
      });
    }
  }, {
    key: "asyncComparePassword",
    value: function asyncComparePassword(password, hash) {
      // returns promise
      return _bcryptjs["default"].compare(password, hash);
    }
  }]);

  return Password;
}();

var _default = Password;
/* function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function asyncHashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) reject(error);
        resolve(hash);
      });
    });
  });
}

function asyncComparePassword(password, hash) {
  // returns promise
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
  asyncHashPassword,
  asyncComparePassword,
}; */

exports["default"] = _default;