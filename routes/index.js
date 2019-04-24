const express = require('express');

const router = express.Router();

/* -------- ROUTES ---------------- */
const homeRoute = require('./home');
const authRoute = require('./user');
const userRoute = require('./user-route');
const accountRoute = require('./account');
const transactionRoute = require('./transaction');

router.use('/', homeRoute);
router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/accounts', accountRoute);
router.use('/transactions', transactionRoute);

module.exports = router;
