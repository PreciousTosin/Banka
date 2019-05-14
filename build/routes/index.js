"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _home = _interopRequireDefault(require("./home"));

var _user = _interopRequireDefault(require("./user"));

var _userRoute = _interopRequireDefault(require("./user-route"));

var _account = _interopRequireDefault(require("./account"));

var _transaction = _interopRequireDefault(require("./transaction"));

var _swaggerDocs = _interopRequireDefault(require("./swagger-docs"));

var _testEmail = _interopRequireDefault(require("./test-email"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* -------- ROUTES ---------------- */
var router = _express["default"].Router();

router.use('/', _home["default"]);
router.use('/auth', _user["default"]);
router.use('/user', _userRoute["default"]);
router.use('/accounts', _account["default"]);
router.use('/transactions', _transaction["default"]);
router.use('/api-docs', _swaggerDocs["default"]);
router.use('/test-mail', _testEmail["default"]);
var _default = router;
exports["default"] = _default;