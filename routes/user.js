const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const user = process.env.DATASOURCE === 'datastructure'
  ? require('../data-structure/controllers/user')
  : require('../database/controllers/user');
const account = process.env.DATASOURCE === 'datastructure'
  ? require('../data-structure/controllers/account')
  : require('../database/controllers/account');
const { isUser, isAdmin } = require('../middleware/authorization');

const router = express.Router();

router.get('/users', isAdmin, async (req, res) => res.json(await user.returnAllUsers()));

router.get('/users/:id', isUser, async (req, res) => res.json(await user.findUserById(req.params.id)));

router.get('/users/:email/accounts', async (req, res) => {
  try {
    const response = await account.getUserAccountsByEmail(req.params.email);
    res.status(response.status).json(response);
  } catch (e) {
    res.status(e.status).json(e);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const userPayload = req.body;
    const updatedUser = await user.createUser(userPayload);
    const response = Object.assign({}, {
      status: 200,
      data: updatedUser,
    });
    res.status(response.status).json(response);
  } catch (error) {
    // console.log('ROUTE ERROR', error);
    res.status(error.status).json(error);
    // next(error);
  }
});

router.post('/signin', async (req, res) => {
  try {
    const userPayload = req.body;
    const response = await user.loginUser(userPayload);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch('/users/:id', isUser, async (req, res) => {
  try {
    const updatePayload = {
      id: req.params.id,
      ...req.body,
    };
    const updatedUser = await user.updateUser(updatePayload);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const response = await user.deleteUser(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
