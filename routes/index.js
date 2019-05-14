import express from 'express';

/* -------- ROUTES ---------------- */
import homeRoute from './home';
import authRoute from './user';
import userRoute from './user-route';
import accountRoute from './account';
import transactionRoute from './transaction';
import docsRoute from './swagger-docs';
import mailRoute from './test-email';

const router = express.Router();

router.use('/', homeRoute);
router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/accounts', accountRoute);
router.use('/transactions', transactionRoute);
router.use('/api-docs', docsRoute);
router.use('/test-mail', mailRoute);

export default router;
