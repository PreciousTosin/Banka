"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _account = _interopRequireDefault(require("../database/controllers/account"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import Authorization from '../middleware/authorization';
// const { isUser, isAdmin } = Authorization;
var router = _express["default"].Router();

router.get('/:email/accounts', _account["default"].getUserAccountsByEmail);
var _default = router;
exports["default"] = _default;