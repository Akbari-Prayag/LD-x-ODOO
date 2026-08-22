const mongoose = require('mongoose')

// TripActivity links an activity to a specific TripStop with scheduling info
const tripActivitySchema = new mongoose.Schema({
  tripStop: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'TripStop',
    required: true,
    index:    true,
  },
  trip: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Trip',
    required: true,
    index:    true,
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Activity',
  },

  // For custom/manual activities not in the activity DB
  customName:        { type: String, trim: true },
  customDescription: { type: String, default: '' },
  customCost:        { type: Number, default: 0 },

  scheduledDate: { type: Date },
  startTime:     { type: String, default: '' },  // e.g. '09:00'
  endTime:       { type: String, default: '' },  // e.g. '11:30'

  status: {
    type:    String,
    enum:    ['planned', 'booked', 'completed', 'cancelled'],
    default: 'planned',
  },

  order: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, {
  timestamps: true,
})

tripActivitySchema.index({ tripStop: 1, order: 1 })
tripActivitySchema.index({ trip: 1 })

module.exports = mongoose.model('TripActivity', tripActivitySchema)
