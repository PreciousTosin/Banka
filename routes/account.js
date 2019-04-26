import express from 'express';
import Authorization from '../middleware/authorization';
import account from '../database/controllers/account';
import transaction from '../database/controllers/transaction';

const { isUser, isStaffOrAdmin } = Authorization;

const router = express.Router();

router.get('/', isStaffOrAdmin, account.returnAllAccounts);

router.get('/:accountNumber', account.getUserAccounts);

router.get('/:accountNumber/transactions', transaction.getTransactionByAccount);

router.post('/', isUser, account.createBankAccount);

router.patch('/:accountNumber', isStaffOrAdmin, account.patchBankAccount);

router.delete('/:accountNumber', isStaffOrAdmin, account.deleteBankAccount);

export default router;
