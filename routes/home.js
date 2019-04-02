const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.json({ greetings: 'THIS IS THE BANKA API' }));

module.exports = router;
