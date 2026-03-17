const Repair = require('../models/Repair');

const getAllRepairs = async (req, res) => {
  try {
    const repairs = await Repair.findAll({ 
      where: { userId: req.user.id },
      order: [['dateReceived', 'DESC']]
    });
    res.json(repairs);
  } catch (error) {
    console.error('Get repairs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createRepair = async (req, res) => {
  try {
    const { customerName, phoneNumber, device, problemDescription, repairCost } = req.body;

    const repair = await Repair.create({
      userId: req.user.id,
      customerName,
      phoneNumber,
      device,
      problemDescription,
      repairCost: repairCost || 0,
    });

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

    const repair = await Repair.findOne({
      where: { id, userId: req.user.id }
    });

    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }

    repair.customerName = customerName;
    repair.phoneNumber = phoneNumber;
    repair.device = device;
    repair.problemDescription = problemDescription;
    repair.repairCost = repairCost;
    repair.status = status;
    repair.dateCompleted = dateCompleted;

    await repair.save();
    res.json(repair);
  } catch (error) {
    console.error('Update repair error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllRepairs, createRepair, updateRepair };
