const express = require('express');
const { getAllSavings, createSaving } = require('../controllers/savingsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAllSavings);
router.post('/', auth, createSaving);

module.exports = router;