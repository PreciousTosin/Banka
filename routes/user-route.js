import express from 'express';
// import Authorization from '../middleware/authorization';
import account from '../database/controllers/account';
// const { isUser, isAdmin } = Authorization;

const router = express.Router();

router.get('/:email/accounts', async (req, res) => {
  try {
    const response = await account.getUserAccountsByEmail(req.params.email);
    res.status(response.status).json(response);
  } catch (e) {
    res.status(e.status).json(e);
  }
});

export default router;
