"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jwtToken = _interopRequireDefault(require("../utilities/jwt-token"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var verifyToken = _jwtToken["default"].verifyToken;

var extractToken = function extractToken(req) {
  var token = req.headers['x-access-token'] || req.headers.authorization;

  if (token === undefined) {
    return false;
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    return token.slice(7, token.length);
  }

  return false;
};

var Authorization =
/*#__PURE__*/
function () {
  function Authorization() {
    _classCallCheck(this, Authorization);
  }

  _createClass(Authorization, null, [{
    key: "isUser",
    value: function isUser(req, res, next) {
      var token = extractToken(req);

      if (token !== false) {
        verifyToken(token).then(function (response) {
          req.authData = {
            id: response.id,
            email: response.email,
            type: response.type,
            isAdmin: response.isAdmin
          };
          next();
        })["catch"](function (error) {
          return res.status(401).json({
            status: 401,
            error: error.message
          });
        });
      } else {
        return res.status(401).json({
          status: 401,
          message: 'Auth token is not supplied'
        });
      }

      return 'token error';
    }
  }, {
    key: "isAdmin",
    value: function isAdmin(req, res, next) {
      var token = extractToken(req);

      if (token !== false) {
        verifyToken(token).then(function (response) {
          if (response.isAdmin === true) {
            req.authData = {
              id: response.id,
              email: response.email,
              type: response.type,
              isAdmin: response.isAdmin
            };
            return next();
          }

          return res.status(401).json({
            status: 401,
            error: 'User is not an admin'
          });
        })["catch"](function (error) {
          return res.status(401).json({
            status: 401,
            error: error.message
          });
        });
      } else {
        return res.status(401).json({
          status: 401,
          error: 'Auth token is not supplied'
        });
      }

      return 'token error';
    }
  }, {
    key: "isStaff",
    value: function isStaff(req, res, next) {
      var token = extractToken(req);

      if (token !== false) {
        verifyToken(token).then(function (response) {
          if (response.type === 'staff') {
            req.authData = {
              id: response.id,
              email: response.email,
              type: response.type,
              isAdmin: response.isAdmin
            };
            return next();
          }

          return res.status(401).json({
            status: 401,
            error: 'User is not a staff'
          });
        })["catch"](function (error) {
          return res.status(401).json({
            status: 401,
            error: error.message
          });
        });
      } else {
        return res.status(401).json({
          status: 401,
          error: 'Auth token is not supplied'
        });
      }

      return 'token error';
    }
  }, {
    key: "isStaffOrAdmin",
    value: function isStaffOrAdmin(req, res, next) {
      var token = extractToken(req);

      if (token !== false) {
        verifyToken(token).then(function (response) {
          if (response.type === 'staff' || response.type === 'admin') {
            req.authData = {
              id: response.id,
              email: response.email,
              type: response.type,
              isAdmin: response.isAdmin
            };
            return next();
          }

          return res.status(401).json({
            status: 401,
            error: 'User is neither a staff nor admin'
          });
        })["catch"](function (error) {
          return res.status(401).json({
            status: 401,
            error: error.message
          });
        });
      } else {
        return res.status(401).json({
          status: 401,
          error: 'Auth token is not supplied'
        });
      }

      return 'token error';
    }
  }]);

  return Authorization;
}();

var _default = Authorization;
exports["default"] = _default;