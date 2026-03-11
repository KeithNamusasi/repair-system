const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, buyPrice, sellPrice, stockQuantity, supplier } = req.body;

    const product = new Product({
      userId: req.user.id,
      name,
      category,
      buyPrice,
      sellPrice,
      stockQuantity,
      supplier,
    });

    await product.save();
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

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name, category, buyPrice, sellPrice, stockQuantity, supplier },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };