const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({ 
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPurchase = async (req, res) => {
  try {
    const { productId, supplier, quantity, buyingPrice } = req.body;

    const product = await Product.findOne({ where: { id: productId, userId: req.user.id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const totalCost = buyingPrice * quantity;

    const purchase = await Purchase.create({
      userId: req.user.id,
      productId,
      supplier,
      quantity,
      buyingPrice,
      totalCost,
    });

    product.stockQuantity += quantity;
    product.buyPrice = buyingPrice;
    await product.save();

    res.status(201).json(purchase);
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllPurchases, createPurchase };
