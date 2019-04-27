"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authorization = _interopRequireDefault(require("../middleware/authorization"));

var _transaction = _interopRequireDefault(require("../database/controllers/transaction"));

var _validateTransaction = _interopRequireDefault(require("../database/validation/validateTransaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var checkCreateTransaction = _validateTransaction["default"].checkCreateTransaction;
var checkCreate = checkCreateTransaction();
var isStaff = _authorization["default"].isStaff,
    isStaffOrAdmin = _authorization["default"].isStaffOrAdmin;

var router = _express["default"].Router();

router.get('/', isStaffOrAdmin, _transaction["default"].returnAllTransations);
router.get('/:id', isStaffOrAdmin, _transaction["default"].getOneTransaction);
router.post('/:accountNumber/credit', isStaff, checkCreate, _transaction["default"].createTransaction);
router.post('/:accountNumber/debit', isStaff, checkCreate, _transaction["default"].createTransaction);
router["delete"]('/:id', isStaffOrAdmin, _transaction["default"].deleteTransaction);
var _default = router;
exports["default"] = _default;