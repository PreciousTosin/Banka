import express from 'express';
// import Authorization from '../middleware/authorization';
import account from '../database/controllers/account';
// const { isUser, isAdmin } = Authorization;

const router = express.Router();

router.get('/:email/accounts', account.getUserAccountsByEmail);

export default router;
