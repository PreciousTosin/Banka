import express from 'express';
import Authorization from '../middleware/authorization';
import account from '../database/controllers/account';
import transaction from '../database/controllers/transaction';

const { isUser, isStaffOrAdmin } = Authorization;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (req.query.status) {
      const accounts = await account.getAccountsByStatus(req.query.status);
      return res.status(200).json(accounts);
    }
    const accounts = await account.returnAllAccounts();
    return res.status(200).json(accounts);
  } catch (e) {
    res.status(400).json(e);
  }
  return true;
});

router.get('/:accountNumber', async (req, res) => {
  try {
    const accounts = await account.getUserAccounts(req.params.accountNumber);
    res.status(200).json(accounts);
  } catch (e) {
    res.status(e.status).json(e);
  }
});

router.get('/:accountNumber/transactions', async (req, res) => {
  try {
    const accounts = await transaction.getTransactionByAccount(req.params.accountNumber);
    res.status(200).json(accounts);
  } catch (e) {
    res.status(e.status).json(e);
  }
});

router.get('/?status=', async (req, res) => {
  try {
    // const accounts = await account.getUserAccounts(req.params.id);
    // res.status(200).json(accounts);
    res.status(200).json(req.query);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post('/', isUser, async (req, res) => {
  try {
    const payload = req.body;
    const newAccount = await account.createBankAccount(payload);
    const response = Object.assign({}, { status: 200, data: newAccount });
    res.status(200).json(response);
  } catch (e) {
    const errorResponse = e.message ? Object.assign({}, { status: 400, error: e.message })
      : Object.assign({}, { status: 400, error: e });
    res.status(400).json(errorResponse);
  }
});

router.patch('/:accountNumber', isStaffOrAdmin, async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const payload = {
      accountNumber: Number(accountNumber),
      ...req.body,
    };
    const patchPayload = await account.patchBankAccount(payload);
    const response = Object.assign({}, { status: 200, data: patchPayload });
    res.status(response.status).json(response);
  } catch (e) {
    console.log('ERROR: ', e);
    const errorResponse = Object.assign({}, { status: 400, error: e });
    res.status(400).json(errorResponse);
  }
});

router.delete('/:accountNumber', isStaffOrAdmin, async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const response = await account.deleteBankAccount(accountNumber);
    res.status(response.status).json(response);
  } catch (e) {
    res.status(400).json(e);
  }
});

export default router;
