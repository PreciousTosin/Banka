const express = require('express');

const router = express.Router();

/* -------- ROUTES ---------------- */
const homeRoute = require('./home');
const userRoute = require('./user');
const accountRoute = require('./account');
const transactionRoute = require('./transaction');

router.use('/', homeRoute);
router.use('/auth', userRoute);
router.use('/accounts', accountRoute);
router.use('/transactions', transactionRoute);

module.exports = router;
