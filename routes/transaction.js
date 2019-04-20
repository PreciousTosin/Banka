const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const transaction = process.env.DATASOURCE === 'datastructure'
  ? require('../data-structure/controllers/transaction')
  : require('../database/controllers/transaction');
const { isStaff, isStaffOrAdmin } = require('../middleware/authorization');

const router = express.Router();

router.get('/', isStaffOrAdmin, async (req, res) => {
  try {
    const response = await transaction.returnAllTransations();
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.get('/:id', isStaffOrAdmin, async (req, res) => {
  try {
    const response = await transaction.getOneTransaction(req.params.id);
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json(e);
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
    const response = await transaction.createTransaction(creditPayload);
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json(Object.assign({}, { status: 400, error: e.message }));
  }
});

router.post('/:accountNumber/debit', isStaff, async (req, res) => {
  try {
    const debitPayload = {
      id: '',
      createdOn: '',
      type: req.body.type,
      accountNumber: Number(req.params.accountNumber),
      cashier: Number(req.body.cashier),
      amount: Number(req.body.amount),
      oldBalance: 0,
      newBalance: 0,
    };
    const response = await transaction.createTransaction(debitPayload);
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json(Object.assign({}, { status: 400, error: e.message }));
  }
});

module.exports = router;
