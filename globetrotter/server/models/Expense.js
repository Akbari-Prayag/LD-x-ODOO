const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  trip: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Trip',
    required: true,
    index:    true,
  },
  tripStop: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'TripStop',
  },
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  description: {
    type:     String,
    required: [true, 'Description is required'],
    trim:     true,
    maxlength: [200, 'Description too long'],
  },
  amount: {
    type:     Number,
    required: [true, 'Amount is required'],
    min:      [0.01, 'Amount must be positive'],
  },
  category: {
    type: String,
    enum: ['transport', 'stay', 'activities', 'meals', 'other'],
    required: true,
  },
  date: {
    type:     Date,
    required: true,
    default:  Date.now,
  },
  currency: { type: String, default: 'INR' },
  notes:    { type: String, default: '', maxlength: 300 },
  receipt:  { type: String, default: '' },  // URL to uploaded receipt
}, {
  timestamps: true,
})

expenseSchema.index({ trip: 1, date: -1 })
expenseSchema.index({ trip: 1, category: 1 })

module.exports = mongoose.model('Expense', expenseSchema)
