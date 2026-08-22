const express = require('express')
const router  = express.Router()
const User    = require('../models/User')
const Trip    = require('../models/Trip')
const { protect } = require('../middleware/auth')

router.use(protect)

/**
 * GET /api/users/profile
 */
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDestinations', 'name country image')
    res.json({ success: true, user: user.toSafeJSON() })
  } catch (err) { next(err) }
})

/**
 * PUT /api/users/profile
 */
router.put('/profile', async (req, res, next) => {
  try {
    const { name, avatar, preferences } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar, preferences },
      { new: true, runValidators: true }
    )
    res.json({ success: true, user: user.toSafeJSON() })
  } catch (err) { next(err) }
})

/**
 * PUT /api/users/password
 */
router.put('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) { next(err) }
})

/**
 * DELETE /api/users/account
 */
router.delete('/account', async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false })
    res.json({ success: true, message: 'Account deactivated' })
  } catch (err) { next(err) }
})

/**
 * POST /api/users/saved-destinations/:cityId
 */
router.post('/saved-destinations/:cityId', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    const cityId = req.params.cityId

    if (user.savedDestinations.includes(cityId)) {
      user.savedDestinations = user.savedDestinations.filter(id => id.toString() !== cityId)
    } else {
      user.savedDestinations.push(cityId)
    }
    await user.save()
    res.json({ success: true, savedDestinations: user.savedDestinations })
  } catch (err) { next(err) }
})

module.exports = router
