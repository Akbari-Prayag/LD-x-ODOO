const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Activity = sequelize.define('Activity', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  name: {
    type:      DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type:         DataTypes.TEXT,
    defaultValue: '',
  },
  image: {
    type:         DataTypes.STRING(500),
    defaultValue: '',
  },
  images: {
    type:         DataTypes.JSON,
    defaultValue: [],
  },
  cityId: {
    type:      DataTypes.INTEGER,
    allowNull: true,
  },
  category: {
    type:         DataTypes.ENUM('sightseeing', 'food', 'adventure', 'culture', 'shopping', 'nature', 'entertainment', 'nightlife', 'other'),
    defaultValue: 'other',
  },
  estimatedCost: {
    type:         DataTypes.FLOAT,
    defaultValue: 0,
  },
  durationValue: {
    type:         DataTypes.FLOAT,
    defaultValue: 1,
  },
  durationUnit: {
    type:         DataTypes.ENUM('minutes', 'hours', 'days'),
    defaultValue: 'hours',
  },
  ratingAverage: {
    type:         DataTypes.FLOAT,
    defaultValue: 0,
  },
  ratingCount: {
    type:         DataTypes.INTEGER,
    defaultValue: 0,
  },
  address: {
    type:         DataTypes.STRING(255),
    defaultValue: '',
  },
  tags: {
    type:         DataTypes.JSON,
    defaultValue: [],
  },
  isActive: {
    type:         DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

module.exports = Activity
