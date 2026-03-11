const Saving = require('../models/Saving');

const getAllSavings = async (req, res) => {
  try {
    const savings = await Saving.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(savings);
  } catch (error) {
    console.error('Get savings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSaving = async (req, res) => {
  try {
    const { amount, note } = req.body;

    const saving = new Saving({
      userId: req.user.id,
      amount,
      note,
    });

    await saving.save();
    res.status(201).json(saving);
  } catch (error) {
    console.error('Create saving error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllSavings, createSaving };