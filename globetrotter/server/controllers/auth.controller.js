const jwt  = require('jsonwebtoken')
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
    if (!user || !(await user.comparePassword(password))) {
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
      return res.json({ success: true, message: 'If this email exists, a reset link will be sent.' })
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    user.passwordResetToken   = resetToken
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    const resetURL = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`

    res.json({
      success: true,
      message: 'Password reset link generated',
      ...(process.env.NODE_ENV === 'development' && { resetURL }),
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token }    = req.params
    const { password } = req.body

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user    = await User.findOne({
      where: {
        id: decoded.id,
        passwordResetToken: token,
      },
    })

    if (!user || (user.passwordResetExpires && new Date(user.passwordResetExpires) < new Date())) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' })
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
