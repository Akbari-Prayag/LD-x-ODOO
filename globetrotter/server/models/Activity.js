const mongoose = require('mongoose')

const CATEGORIES = [
  'sightseeing', 'food', 'adventure', 'culture',
  'shopping',    'nature', 'entertainment', 'nightlife', 'other',
]

const activitySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '', maxlength: 1000 },
  image:       { type: String, default: '' },
  images:      [{ type: String }],

  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'City',
    index: true,
  },

  category: {
    type:    String,
    enum:    CATEGORIES,
    default: 'other',
  },

  estimatedCost: {
    type: Number,
    default: 0,
    min:     0,
  },

  duration: {
    value: { type: Number, default: 1 },
    unit:  { type: String, enum: ['minutes', 'hours', 'days'], default: 'hours' },
  },

  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count:   { type: Number, default: 0 },
  },

  location: {
    address: { type: String, default: '' },
    lat:     { type: Number },
    lng:     { type: Number },
  },

  tags:     [{ type: String }],
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

activitySchema.index({ name: 'text', description: 'text' })
activitySchema.index({ city: 1, category: 1 })
activitySchema.index({ category: 1 })
activitySchema.index({ 'rating.average': -1 })

module.exports = mongoose.model('Activity', activitySchema)
