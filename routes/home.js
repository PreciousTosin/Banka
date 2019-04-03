const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.json({ greetings: 'THIS IS THE BANKA API' }));

router.get('/test', (req, res) => res.json({ greetings: 'THIS IS AN API TEST ROUTE' }));

module.exports = router;
