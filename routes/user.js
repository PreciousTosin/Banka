const express = require('express');
const user = require('../controllers/user');

const router = express.Router();


router.get('/', async (req, res) => res.json(await user.returnAllUsers()));

router.get('/:id', async (req, res) => res.json(await user.findUserById(req.params.id)));

router.post('/', async (req, res) => {
  try {
    const userPayload = req.body;
    const updatedUser = await user.createUser(userPayload);
    res.status(200).json(updatedUser);
  } catch (error) {
    // console.log(error);
    res.status(400).json(error);
    // next(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatePayload = {
      id: req.params.id,
      ...req.body,
    };
    const updatedUser = await user.updateUser(updatePayload);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await user.deleteUser(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
