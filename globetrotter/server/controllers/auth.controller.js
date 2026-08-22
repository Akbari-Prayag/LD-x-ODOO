const jwt  = require('jsonwebtoken')
const crypto = require('crypto')
const { User } = require('../models')

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ where: { email } })
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const user  = await User.create({ name, email, password })
    const token = signToken(user.id)

    res.status(201).json({
      success: true,
      token,
      user: user.toSafeJSON(),
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' })
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated' })
    }

    const token = signToken(user.id)

    res.json({
      success: true,
      token,
      user: user.toSafeJSON(),
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    res.json({ success: true, user: user.toSafeJSON() })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')

    // Prefix lets us differentiate OTP hashes from temporary reset session tokens.
    user.passwordResetToken   = `otp:${otpHash}`
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    // TODO: Plug this into an email/SMS provider in production.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔐 Password reset OTP for ${email}: ${otp}`)
    }

    res.json({
      success: true,
      message: 'If this email exists, an OTP has been sent.',
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/verify-reset-otp
 */
exports.verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user || !user.passwordResetToken || !user.passwordResetToken.startsWith('otp:')) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
    }

    if (!user.passwordResetExpires || new Date(user.passwordResetExpires) < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' })
    }

    const incomingHash = crypto.createHash('sha256').update(String(otp).trim()).digest('hex')
    const savedHash = user.passwordResetToken.replace('otp:', '')

    if (incomingHash !== savedHash) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    const resetToken = jwt.sign(
      { id: user.id, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    )

    user.passwordResetToken = `reset:${resetToken}`
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()

    return res.json({ success: true, message: 'OTP verified', resetToken })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, password } = req.body

    if (!resetToken || !password) {
      return res.status(400).json({ success: false, message: 'Reset token and password are required' })
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ success: false, message: 'Invalid reset token' })
    }

    const user    = await User.findOne({
      where: {
        id: decoded.id,
        passwordResetToken: `reset:${resetToken}`,
      },
    })

    if (!user || (user.passwordResetExpires && new Date(user.passwordResetExpires) < new Date())) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset session' })
    }

    user.password             = password
    user.passwordResetToken   = null
    user.passwordResetExpires = null
    await user.save()

    const newToken = signToken(user.id)
    res.json({ success: true, token: newToken, user: user.toSafeJSON() })
  } catch (err) {
    next(err)
  }
}
