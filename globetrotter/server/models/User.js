const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Name is required'],
    trim:     true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type:      String,
    required:  [true, 'Email is required'],
    unique:    true,
    lowercase: true,
    trim:      true,
    match:     [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  password: {
    type:      String,
    required:  [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select:    false,  // Never return password in queries
  },
  avatar: {
    type:    String,
    default: '',
  },
  role: {
    type:    String,
    enum:    ['user', 'admin'],
    default: 'user',
  },
  preferences: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
  },
  savedDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:  'City',
  }],
  passwordResetToken:   String,
  passwordResetExpires: Date,
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

// ─── Hooks ───────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// ─── Methods ─────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.passwordResetToken
  delete obj.passwordResetExpires
  return obj
}

// ─── Indexes ─────────────────────────────────────────────────
userSchema.index({ email: 1 })

module.exports = mongoose.model('User', userSchema)
