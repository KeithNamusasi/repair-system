const express = require('express');
const { getAllPurchases, createPurchase } = require('../controllers/purchasesController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAllPurchases);
router.post('/', auth, createPurchase);

module.exports = router;