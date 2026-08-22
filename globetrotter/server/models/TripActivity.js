const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const TripActivity = sequelize.define('TripActivity', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  tripStopId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  tripId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  activityId: {
    type:      DataTypes.INTEGER,
    allowNull: true,
  },
  customName: {
    type:         DataTypes.STRING(150),
    defaultValue: '',
  },
  customDescription: {
    type:         DataTypes.TEXT,
    defaultValue: '',
  },
  customCost: {
    type:         DataTypes.FLOAT,
    defaultValue: 0,
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
  },
  startTime: {
    type:         DataTypes.STRING(20),
    defaultValue: '',
  },
  endTime: {
    type:         DataTypes.STRING(20),
    defaultValue: '',
  },
  status: {
    type:         DataTypes.ENUM('planned', 'booked', 'completed', 'cancelled'),
    defaultValue: 'planned',
  },
  order: {
    type:         DataTypes.INTEGER,
    defaultValue: 0,
  },
  notes: {
    type:         DataTypes.TEXT,
    defaultValue: '',
  },
})

module.exports = TripActivity
