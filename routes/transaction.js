import express from 'express';
import Authorization from '../middleware/authorization';
import transaction from '../database/controllers/transaction';

const { isStaff, isStaffOrAdmin } = Authorization;

const router = express.Router();

router.get('/', isStaffOrAdmin, transaction.returnAllTransations);

router.get('/:id', isStaffOrAdmin, transaction.getOneTransaction);

router.post('/:accountNumber/credit', isStaff, transaction.createTransaction);

router.post('/:accountNumber/debit', isStaff, transaction.createTransaction);

router.delete('/:id', isStaffOrAdmin, transaction.deleteTransaction);

export default router;
