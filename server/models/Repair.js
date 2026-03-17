const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Repair = sequelize.define('Repair', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  device: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  problemDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  repairCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Repair', 'Completed', 'Collected'),
    defaultValue: 'Pending'
  },
  dateReceived: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  dateCompleted: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'repairs',
  timestamps: true
});

module.exports = Repair;
