import express from 'express';
import Authorization from '../middleware/authorization';
import transaction from '../database/controllers/transaction';
import ValidateTransaction from '../database/validation/validateTransaction';

const { checkCreateTransaction } = ValidateTransaction;
const checkCreate = checkCreateTransaction();

const { isStaff, isStaffOrAdmin, isUser } = Authorization;

const router = express.Router();

router.get('/', isUser, transaction.returnAllTransations);

router.get('/:id', isStaffOrAdmin, transaction.getOneTransaction);

router.post('/:accountNumber/credit', isStaff, checkCreate, transaction.createTransaction);

router.post('/:accountNumber/debit', isStaff, checkCreate, transaction.createTransaction);

router.delete('/:id', isStaffOrAdmin, transaction.deleteTransaction);

export default router;
