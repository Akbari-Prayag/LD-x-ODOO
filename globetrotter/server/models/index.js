const { sequelize } = require('../config/database')
const User         = require('./User')
const City         = require('./City')
const Activity     = require('./Activity')
const Trip         = require('./Trip')
const TripStop     = require('./TripStop')
const TripActivity = require('./TripActivity')
const Expense      = require('./Expense')

// ─── Associations ─────────────────────────────────────────────

// User <-> Trip
User.hasMany(Trip, { as: 'trips', foreignKey: 'ownerId', onDelete: 'CASCADE' })
Trip.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' })

// User <-> Saved Destinations (City)
User.belongsToMany(City, { through: 'SavedDestinations', as: 'savedDestinations', foreignKey: 'userId', otherKey: 'cityId' })
City.belongsToMany(User, { through: 'SavedDestinations', as: 'savedByUsers', foreignKey: 'cityId', otherKey: 'userId' })

// City <-> Activity
City.hasMany(Activity, { as: 'activities', foreignKey: 'cityId' })
Activity.belongsTo(City, { as: 'city', foreignKey: 'cityId' })

// Trip <-> TripStop
Trip.hasMany(TripStop, { as: 'stops', foreignKey: 'tripId', onDelete: 'CASCADE' })
TripStop.belongsTo(Trip, { as: 'trip', foreignKey: 'tripId' })

// TripStop <-> City
TripStop.belongsTo(City, { as: 'city', foreignKey: 'cityId' })
City.hasMany(TripStop, { foreignKey: 'cityId' })

// TripStop <-> TripActivity
TripStop.hasMany(TripActivity, { as: 'activities', foreignKey: 'tripStopId', onDelete: 'CASCADE' })
TripActivity.belongsTo(TripStop, { as: 'stop', foreignKey: 'tripStopId' })

// Trip <-> TripActivity
Trip.hasMany(TripActivity, { foreignKey: 'tripId', onDelete: 'CASCADE' })
TripActivity.belongsTo(Trip, { foreignKey: 'tripId' })

// TripActivity <-> Activity
TripActivity.belongsTo(Activity, { as: 'activity', foreignKey: 'activityId' })
Activity.hasMany(TripActivity, { foreignKey: 'activityId' })

// Trip <-> Expense
Trip.hasMany(Expense, { as: 'expenses', foreignKey: 'tripId', onDelete: 'CASCADE' })
Expense.belongsTo(Trip, { as: 'trip', foreignKey: 'tripId' })

// User <-> Expense
User.hasMany(Expense, { foreignKey: 'userId' })
Expense.belongsTo(User, { as: 'user', foreignKey: 'userId' })

// TripStop <-> Expense
TripStop.hasMany(Expense, { foreignKey: 'tripStopId' })
Expense.belongsTo(TripStop, { as: 'stop', foreignKey: 'tripStopId' })

module.exports = {
  sequelize,
  User,
  City,
  Activity,
  Trip,
  TripStop,
  TripActivity,
  Expense,
}
