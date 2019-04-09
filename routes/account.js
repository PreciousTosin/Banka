const express = require('express');
const account = require('../controllers/account');
const { isUser, isAdmin } = require('../middleware/authorization');

const router = express.Router();

router.get('/', isAdmin, async (req, res) => {
  try {
    const accounts = await account.returnAllAccounts();
    res.status(200).json(accounts);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.get('/:id', isUser, async (req, res) => {
  try {
    console.log('ID', req.params.id);
    const accounts = await account.getUserAccounts(req.params.id);
    res.status(200).json(accounts);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const newAccount = await account.createBankAccount(payload);
    const response = Object.assign({}, { status: 200, data: newAccount });
    res.status(200).json(response);
  } catch (e) {
    const errorResponse = Object.assign({}, { status: 400, error: e });
    res.status(400).json(errorResponse);
  }
});

router.patch('/:accountNumber', isAdmin, async (req, res) => {
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

module.exports = router;
