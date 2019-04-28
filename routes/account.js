import express from 'express';
import Authorization from '../middleware/authorization';
import account from '../database/controllers/account';
import transaction from '../database/controllers/transaction';
import ValidateAccount from '../database/validation/validateAccount';

const { checkCreateAccount, checkUpdateAccount } = ValidateAccount;
const checkCreate = checkCreateAccount();
const checkUpdate = checkUpdateAccount();

const { isUser, isStaffOrAdmin } = Authorization;

const router = express.Router();

router.get('/', isStaffOrAdmin, account.returnAllAccounts);

router.get('/:accountNumber', isUser, account.getUserAccounts);

router.get('/:accountNumber/transactions', isUser, transaction.getTransactionByAccount);

router.post('/', isUser, checkCreate, account.createBankAccount);

router.patch('/:accountNumber', isStaffOrAdmin, checkUpdate, account.patchBankAccount);

router.delete('/:accountNumber', isStaffOrAdmin, account.deleteBankAccount);

export default router;
