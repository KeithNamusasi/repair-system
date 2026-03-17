const Sale = require('../models/Sale');
const Product = require('../models/Product');

const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({ 
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSale = async (req, res) => {
  try {
    const { productId, quantity, paymentMethod } = req.body;

    const product = await Product.findOne({ where: { id: productId, userId: req.user.id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const sellingPrice = parseFloat(product.sellPrice);
    const total = sellingPrice * quantity;
    const profit = (sellingPrice - parseFloat(product.buyPrice)) * quantity;

    const sale = await Sale.create({
      userId: req.user.id,
      productId,
      productName: product.name,
      quantity,
      sellingPrice,
      total,
      profit,
      paymentMethod,
    });

    product.stockQuantity -= quantity;
    await product.save();

    res.status(201).json(sale);
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllSales, createSale };
