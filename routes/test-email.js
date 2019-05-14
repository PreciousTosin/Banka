import express from 'express';
import mail from '../database/controllers/email';

const router = express.Router();

router.get('/', mail.testMail);

export default router;
