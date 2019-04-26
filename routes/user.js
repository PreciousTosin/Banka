import express from 'express';
import user from '../database/controllers/user';
import account from '../database/controllers/account';
import Authorization from '../middleware/authorization';

const { isUser, isAdmin } = Authorization;

const router = express.Router();

router.get('/users', isAdmin, user.returnAllUsers);

router.get('/users/:id', isUser, user.findUserById);

router.get('/users/:email/accounts', account.getUserAccountsByEmail);

router.post('/signup', user.createUser);

router.post('/signin', user.loginUser);

router.patch('/users/:id', isUser, user.updateUser);

router.delete('/users/:id', isAdmin, user.deleteUser);

export default router;
