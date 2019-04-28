"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authorization = _interopRequireDefault(require("../middleware/authorization"));

var _account = _interopRequireDefault(require("../database/controllers/account"));

var _transaction = _interopRequireDefault(require("../database/controllers/transaction"));

var _validateAccount = _interopRequireDefault(require("../database/validation/validateAccount"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var checkCreateAccount = _validateAccount["default"].checkCreateAccount,
    checkUpdateAccount = _validateAccount["default"].checkUpdateAccount;
var checkCreate = checkCreateAccount();
var checkUpdate = checkUpdateAccount();
var isUser = _authorization["default"].isUser,
    isStaffOrAdmin = _authorization["default"].isStaffOrAdmin;

var router = _express["default"].Router();

router.get('/', isStaffOrAdmin, _account["default"].returnAllAccounts);
router.get('/:accountNumber', isUser, _account["default"].getUserAccounts);
router.get('/:accountNumber/transactions', isUser, _transaction["default"].getTransactionByAccount);
router.post('/', isUser, checkCreate, _account["default"].createBankAccount);
router.patch('/:accountNumber', isStaffOrAdmin, checkUpdate, _account["default"].patchBankAccount);
router["delete"]('/:accountNumber', isStaffOrAdmin, _account["default"].deleteBankAccount);
var _default = router;
exports["default"] = _default;