const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, index: true },
  country:     { type: String, required: true, trim: true },
  region:      { type: String, default: '', trim: true },
  state:       { type: String, default: '', trim: true },
  description: { type: String, default: '', maxlength: 1000 },
  image:       { type: String, default: '' },
  images:      [{ type: String }],

  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },

  costIndex: {
    type: Number,
    min:  1,
    max:  5,
    default: 3,
    comment: '1=very cheap, 5=very expensive',
  },

  popularity: {
    type:    Number,
    default: 0,
    min:     0,
    max:     100,
  },

  tags:        [{ type: String, trim: true }],
  bestMonths:  [{ type: String }],

  avgDailyCost: { type: Number, default: 0 },  // in INR

  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

citySchema.index({ name: 'text', country: 'text', description: 'text' })
citySchema.index({ country: 1 })
citySchema.index({ popularity: -1 })
citySchema.index({ costIndex: 1 })

module.exports = mongoose.model('City', citySchema)
