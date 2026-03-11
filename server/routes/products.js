const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAllProducts);
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;