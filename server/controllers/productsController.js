const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, buyPrice, sellPrice, stockQuantity, supplier } = req.body;

    const product = await Product.create({
      userId: req.user.id,
      name,
      category,
      buyPrice,
      sellPrice,
      stockQuantity,
      supplier,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, buyPrice, sellPrice, stockQuantity, supplier } = req.body;

    const product = await Product.findOne({
      where: { id, userId: req.user.id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name;
    product.category = category;
    product.buyPrice = buyPrice;
    product.sellPrice = sellPrice;
    product.stockQuantity = stockQuantity;
    product.supplier = supplier;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ where: { id, userId: req.user.id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };
