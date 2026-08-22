const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const City = sequelize.define('City', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  country: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  region: {
    type:         DataTypes.STRING(100),
    defaultValue: '',
  },
  state: {
    type:         DataTypes.STRING(100),
    defaultValue: '',
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
  lat: {
    type: DataTypes.FLOAT,
  },
  lng: {
    type: DataTypes.FLOAT,
  },
  costIndex: {
    type:         DataTypes.INTEGER,
    defaultValue: 3,
    validate:     { min: 1, max: 5 },
  },
  popularity: {
    type:         DataTypes.INTEGER,
    defaultValue: 0,
    validate:     { min: 0, max: 100 },
  },
  tags: {
    type:         DataTypes.JSON,
    defaultValue: [],
  },
  bestMonths: {
    type:         DataTypes.JSON,
    defaultValue: [],
  },
  avgDailyCost: {
    type:         DataTypes.FLOAT,
    defaultValue: 0,
  },
  isActive: {
    type:         DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

module.exports = City
