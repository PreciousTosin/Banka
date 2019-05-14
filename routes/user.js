import express from 'express';
import user from '../database/controllers/user';
import account from '../database/controllers/account';
import Authorization from '../middleware/authorization';
import ValidateUser from '../database/validation/validateUser';

const { isUser, isAdmin } = Authorization;
const {
  checkCreateUser,
  checkLoginUser,
  checkUpdateUser,
  checkCreateAdmin,
} = ValidateUser;
const checkSignUp = checkCreateUser();
const checkLogin = checkLoginUser();
const checkUserUpdate = checkUpdateUser();
const checkAdminSignUp = checkCreateAdmin();

const router = express.Router();

router.get('/users', isAdmin, user.returnAllUsers);

router.get('/users/:id', isUser, user.findUserById);

router.get('/users/:email/accounts', isUser, account.getUserAccountsByEmail);

router.post('/signup', checkSignUp, user.createUser);
router.post('/signup/admin', isAdmin, checkAdminSignUp, user.createUser);

router.post('/signin', checkLogin, user.loginUser);

router.post('/forgot-password', user.forgotUserPassword);
router.post('/reset-password', user.resetUserPassword);

router.patch('/users/:id', isAdmin, checkUserUpdate, user.updateUser);

router.delete('/users/:id', isAdmin, user.deleteUser);

export default router;
