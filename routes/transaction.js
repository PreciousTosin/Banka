const express = require('express');
const transaction = require('../controllers/transaction');
const { isStaff, isUser } = require('../middleware/authorization');

const router = express.Router();

router.get('/', isUser, async (req, res) => {
  try {
    const transactions = await transaction.returnAllTransations();
    const response = Object.assign({}, { status: 200, data: transactions });
    res.status(200).json(response);
  } catch (e) {
    const errResponse = Object.assign({}, { status: 400, error: e });
    res.status(400).json(errResponse);
  }
});

router.post('/:accountNumber/credit', isStaff, async (req, res) => {
  try {
    const creditPayload = {
      id: '',
      createdOn: '',
      type: req.body.type,
      accountNumber: Number(req.params.accountNumber),
      cashier: Number(req.body.cashier),
      amount: Number(req.body.amount),
      oldBalance: 0,
      newBalance: 0,
    };
    const newTransaction = await transaction.createTransaction(creditPayload);
    const response = Object.assign({}, { status: 200, data: newTransaction });
    res.status(200).json(response);
  } catch (e) {
    const errResponse = Object.assign({}, { status: 400, error: e });
    res.status(400).json(errResponse);
  }
});

router.post('/:accountNumber/debit', isStaff, async (req, res) => {
  try {
    const creditPayload = {
      id: '',
      createdOn: '',
      type: req.body.type,
      accountNumber: Number(req.params.accountNumber),
      cashier: Number(req.body.cashier),
      amount: Number(req.body.amount),
      oldBalance: 0,
      newBalance: 0,
    };
    const newTransaction = await transaction.createTransaction(creditPayload);
    const response = Object.assign({}, { status: 200, data: newTransaction });
    res.status(200).json(response);
  } catch (e) {
    const errResponse = Object.assign({}, { status: 400, error: e });
    res.status(400).json(errResponse);
  }
});

module.exports = router;
