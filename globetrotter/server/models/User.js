const { DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../config/database')

const User = sequelize.define('User', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  name: {
    type:      DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' },
      len:      { args: [2, 50], msg: 'Name must be between 2 and 50 characters' },
    },
  },
  email: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    unique:    { msg: 'Email is already registered' },
    validate: {
      isEmail: { msg: 'Must be a valid email address' },
    },
  },
  password: {
    type:      DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
    },
  },
  avatar: {
    type:         DataTypes.STRING(500),
    defaultValue: '',
  },
  role: {
    type:         DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  currency: {
    type:         DataTypes.STRING(10),
    defaultValue: 'INR',
  },
  language: {
    type:         DataTypes.STRING(10),
    defaultValue: 'en',
  },
  passwordResetToken: {
    type: DataTypes.STRING(255),
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
  },
  isActive: {
    type:         DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12)
      }
    },
  },
})

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

User.prototype.toSafeJSON = function () {
  const values = { ...this.get() }
  delete values.password
  delete values.passwordResetToken
  delete values.passwordResetExpires
  return values
}

module.exports = User
