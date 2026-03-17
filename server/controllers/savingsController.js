const Saving = require('../models/Saving');

const getAllSavings = async (req, res) => {
  try {
    const savings = await Saving.findAll({ 
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(savings);
  } catch (error) {
    console.error('Get savings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSaving = async (req, res) => {
  try {
    const { amount, note } = req.body;

    const saving = await Saving.create({
      userId: req.user.id,
      amount,
      note,
    });

    res.status(201).json(saving);
  } catch (error) {
    console.error('Create saving error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllSavings, createSaving };
