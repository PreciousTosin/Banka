const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
/* const user = process.env.DATASOURCE === 'datastructure'
  ? require('../data-structure/controllers/user')
  : require('../database/controllers/user'); */
const account = process.env.DATASOURCE === 'datastructure'
  ? require('../data-structure/controllers/account')
  : require('../database/controllers/account');
// const { isUser, isAdmin } = require('../middleware/authorization');

const router = express.Router();

router.get('/:email/accounts', async (req, res) => {
  try {
    const response = await account.getUserAccountsByEmail(req.params.email);
    res.status(response.status).json(response);
  } catch (e) {
    res.status(e.status).json(e);
  }
});

module.exports = router;
