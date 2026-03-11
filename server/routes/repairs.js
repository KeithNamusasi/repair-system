const express = require('express');
const { getAllRepairs, createRepair, updateRepair } = require('../controllers/repairsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAllRepairs);
router.post('/', auth, createRepair);
router.put('/:id', auth, updateRepair);

module.exports = router;