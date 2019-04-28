import express from 'express';
import Authorization from '../middleware/authorization';
import account from '../database/controllers/account';

const { isUser } = Authorization;

const router = express.Router();

router.get('/:email/accounts', isUser, account.getUserAccountsByEmail);

export default router;
