const express = require('express');
const user = require('../controllers/user');

const router = express.Router();


router.get('/', (req, res) => res.json(user.returnAllUsers()));

router.get('/:id', (req, res) => res.json(user.findUserById(req.params.id)));

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

module.exports = router;
