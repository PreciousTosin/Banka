"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _user = _interopRequireDefault(require("../database/controllers/user"));

var _account = _interopRequireDefault(require("../database/controllers/account"));

var _authorization = _interopRequireDefault(require("../middleware/authorization"));

var _validateUser = _interopRequireDefault(require("../database/validation/validateUser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isUser = _authorization["default"].isUser,
    isAdmin = _authorization["default"].isAdmin;
var checkCreateUser = _validateUser["default"].checkCreateUser,
    checkLoginUser = _validateUser["default"].checkLoginUser,
    checkUpdateUser = _validateUser["default"].checkUpdateUser,
    checkCreateAdmin = _validateUser["default"].checkCreateAdmin;
var checkSignUp = checkCreateUser();
var checkLogin = checkLoginUser();
var checkUserUpdate = checkUpdateUser();
var checkAdminSignUp = checkCreateAdmin();

var router = _express["default"].Router();

router.get('/users', isAdmin, _user["default"].returnAllUsers);
router.get('/users/:id', isUser, _user["default"].findUserById);
router.get('/users/:email/accounts', isUser, _account["default"].getUserAccountsByEmail);
router.post('/signup', checkSignUp, _user["default"].createUser);
router.post('/signup/admin', checkAdminSignUp, _user["default"].createUser);
router.post('/signin', checkLogin, _user["default"].loginUser);
router.patch('/users/:id', isAdmin, checkUserUpdate, _user["default"].updateUser);
router["delete"]('/users/:id', isAdmin, _user["default"].deleteUser);
var _default = router;
exports["default"] = _default;