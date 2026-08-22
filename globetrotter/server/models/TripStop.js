const mongoose = require('mongoose')

// A TripStop represents one city/destination in a trip
const tripStopSchema = new mongoose.Schema({
  trip: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Trip',
    required: true,
    index:    true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'City',
  },
  // In case city is manually typed (not from DB)
  customCityName: { type: String, trim: true },

  arrivalDate:    { type: Date, required: true },
  departureDate:  { type: Date, required: true },

  notes:  { type: String, maxlength: 500, default: '' },
  order:  { type: Number, default: 0 },    // for drag-and-drop ordering

  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:  'TripActivity',
  }],

  accommodation: {
    name:    { type: String, default: '' },
    address: { type: String, default: '' },
    cost:    { type: Number, default: 0 },
  },
}, {
  timestamps: true,
  toJSON:  { virtuals: true },
  toObject: { virtuals: true },
})

tripStopSchema.virtual('duration').get(function () {
  if (!this.arrivalDate || !this.departureDate) return 0
  return Math.ceil((this.departureDate - this.arrivalDate) / (1000 * 60 * 60 * 24)) + 1
})

tripStopSchema.index({ trip: 1, order: 1 })

module.exports = mongoose.model('TripStop', tripStopSchema)
