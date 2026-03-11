const express = require('express');
const { getAllSales, createSale } = require('../controllers/salesController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAllSales);
router.post('/', auth, createSale);

module.exports = router;