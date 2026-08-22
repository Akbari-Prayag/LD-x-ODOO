const mongoose = require('mongoose')
const slugify  = require('slugify')
const { nanoid } = require('nanoid')

const tripSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Trip name is required'],
    trim:     true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type:      String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default:   '',
  },
  coverPhoto: { type: String, default: '' },
  startDate:  { type: Date, required: [true, 'Start date is required'] },
  endDate:    { type: Date, required: [true, 'End date is required'] },
  budget:     { type: Number, default: 0, min: [0, 'Budget cannot be negative'] },
  currency:   { type: String, default: 'INR' },

  status: {
    type:    String,
    enum:    ['planning', 'upcoming', 'ongoing', 'completed'],
    default: 'planning',
  },

  isPublic:  { type: Boolean, default: false },
  publicSlug: {
    type:   String,
    unique: true,
    sparse: true,
  },

  owner: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true,
  },

  stops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:  'TripStop',
  }],

  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
  }],

  totalSpent: { type: Number, default: 0 },

  tags: [{ type: String, trim: true }],
}, {
  timestamps: true,
  toJSON:     { virtuals: true },
  toObject:   { virtuals: true },
})

// ─── Virtuals ─────────────────────────────────────────────────
tripSchema.virtual('duration').get(function () {
  if (!this.startDate || !this.endDate) return 0
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1
})

tripSchema.virtual('remainingBudget').get(function () {
  return (this.budget || 0) - (this.totalSpent || 0)
})

// ─── Hooks ────────────────────────────────────────────────────
tripSchema.pre('validate', function (next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date cannot be before start date')
  }
  next()
})

tripSchema.pre('save', function (next) {
  if (this.isModified('isPublic') && this.isPublic && !this.publicSlug) {
    const base = slugify(this.name, { lower: true, strict: true })
    this.publicSlug = `${base}-${nanoid(6)}`
  }
  next()
})

// ─── Indexes ──────────────────────────────────────────────────
tripSchema.index({ owner: 1, createdAt: -1 })
tripSchema.index({ publicSlug: 1 })
tripSchema.index({ status: 1 })

module.exports = mongoose.model('Trip', tripSchema)
