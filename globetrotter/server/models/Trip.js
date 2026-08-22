const { DataTypes } = require('sequelize')
const slugify = require('slugify')
const { nanoid } = require('nanoid')
const { sequelize } = require('../config/database')

const Trip = sequelize.define('Trip', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Trip name is required' },
      len:      { args: [2, 100], msg: 'Name must be between 2 and 100 characters' },
    },
  },
  description: {
    type:         DataTypes.TEXT,
    defaultValue: '',
  },
  coverPhoto: {
    type:         DataTypes.TEXT('long'),
    defaultValue: '',
  },
  startDate: {
    type:      DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type:      DataTypes.DATEONLY,
    allowNull: false,
  },
  budget: {
    type:         DataTypes.FLOAT,
    defaultValue: 0,
    validate:     { min: 0 },
  },
  currency: {
    type:         DataTypes.STRING(10),
    defaultValue: 'INR',
  },
  status: {
    type:         DataTypes.ENUM('planning', 'upcoming', 'ongoing', 'completed'),
    defaultValue: 'planning',
  },
  isPublic: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
  },
  publicSlug: {
    type:   DataTypes.STRING(150),
    unique: true,
  },
  ownerId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  totalSpent: {
    type:         DataTypes.FLOAT,
    defaultValue: 0,
  },
  tags: {
    type:         DataTypes.JSON,
    defaultValue: [],
  },
}, {
  hooks: {
    beforeValidate: (trip) => {
      if (trip.startDate && trip.endDate && trip.endDate < trip.startDate) {
        throw new Error('End date cannot be before start date')
      }
    },
    beforeSave: (trip) => {
      if (trip.isPublic && !trip.publicSlug) {
        const base = slugify(trip.name, { lower: true, strict: true })
        trip.publicSlug = `${base}-${nanoid(6)}`
      }
    },
  },
})

module.exports = Trip
