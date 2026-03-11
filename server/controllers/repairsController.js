const Repair = require('../models/Repair');

const getAllRepairs = async (req, res) => {
  try {
    const repairs = await Repair.find({ userId: req.user.id }).sort({ dateReceived: -1 });
    res.json(repairs);
  } catch (error) {
    console.error('Get repairs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createRepair = async (req, res) => {
  try {
    const { customerName, phoneNumber, device, problemDescription, repairCost } = req.body;

    const repair = new Repair({
      userId: req.user.id,
      customerName,
      phoneNumber,
      device,
      problemDescription,
      repairCost,
    });

    await repair.save();
    res.status(201).json(repair);
  } catch (error) {
    console.error('Create repair error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, phoneNumber, device, problemDescription, repairCost, status, dateCompleted } = req.body;

    const repair = await Repair.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { customerName, phoneNumber, device, problemDescription, repairCost, status, dateCompleted },
      { new: true, runValidators: true }
    );

    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }

    res.json(repair);
  } catch (error) {
    console.error('Update repair error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllRepairs, createRepair, updateRepair };