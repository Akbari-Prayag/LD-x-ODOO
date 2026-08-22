const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Expense = sequelize.define('Expense', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  tripId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  tripStopId: {
    type:      DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type:      DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description is required' },
    },
  },
  amount: {
    type:      DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: { args: [0.01], msg: 'Amount must be greater than zero' },
    },
  },
  category: {
    type:      DataTypes.ENUM('transport', 'stay', 'activities', 'meals', 'other'),
    allowNull: false,
  },
  date: {
    type:         DataTypes.DATEONLY,
    allowNull:    false,
    defaultValue: DataTypes.NOW,
  },
  currency: {
    type:         DataTypes.STRING(10),
    defaultValue: 'INR',
  },
  notes: {
    type:         DataTypes.TEXT,
    defaultValue: '',
  },
  receipt: {
    type:         DataTypes.STRING(500),
    defaultValue: '',
  },
})

module.exports = Expense
