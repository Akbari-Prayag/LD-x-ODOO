const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const TripStop = sequelize.define('TripStop', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  tripId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  cityId: {
    type:      DataTypes.INTEGER,
    allowNull: true,
  },
  customCityName: {
    type:         DataTypes.STRING(100),
    defaultValue: '',
  },
  arrivalDate: {
    type:      DataTypes.DATEONLY,
    allowNull: false,
  },
  departureDate: {
    type:      DataTypes.DATEONLY,
    allowNull: false,
  },
  notes: {
    type:         DataTypes.TEXT,
    defaultValue: '',
  },
  order: {
    type:         DataTypes.INTEGER,
    defaultValue: 0,
  },
  accommodationName: {
    type:         DataTypes.STRING(150),
    defaultValue: '',
  },
  accommodationAddress: {
    type:         DataTypes.STRING(255),
    defaultValue: '',
  },
  accommodationCost: {
    type:         DataTypes.FLOAT,
    defaultValue: 0,
  },
})

module.exports = TripStop
