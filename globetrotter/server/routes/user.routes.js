const express = require('express')
const router  = express.Router()
const { User, City } = require('../models')
const { protect } = require('../middleware/auth')

router.use(protect)

/**
 * GET /api/users/profile
 */
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: City, as: 'savedDestinations', attributes: ['id', 'name', 'country', 'image'] }],
    })
    res.json({ success: true, user: user.toSafeJSON() })
  } catch (err) { next(err) }
})

/**
 * PUT /api/users/profile
 */
router.put('/profile', async (req, res, next) => {
  try {
    const { name, avatar, currency, language } = req.body
    const user = await User.findByPk(req.user.id)

    if (name)     user.name     = name
    if (avatar)   user.avatar   = avatar
    if (currency) user.currency = currency
    if (language) user.language = language

    await user.save()
    res.json({ success: true, user: user.toSafeJSON() })
  } catch (err) { next(err) }
})

/**
 * PUT /api/users/password
 */
router.put('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findByPk(req.user.id)

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
    const user = await User.findByPk(req.user.id)
    user.isActive = false
    await user.save()
    res.json({ success: true, message: 'Account deactivated' })
  } catch (err) { next(err) }
})

/**
 * POST /api/users/saved-destinations/:cityId
 */
router.post('/saved-destinations/:cityId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const city = await City.findByPk(req.params.cityId)

    if (!city) return res.status(404).json({ success: false, message: 'City not found' })

    const hasCity = await user.hasSavedDestination(city)
    if (hasCity) {
      await user.removeSavedDestination(city)
    } else {
      await user.addSavedDestination(city)
    }

    const updated = await User.findByPk(req.user.id, {
      include: [{ model: City, as: 'savedDestinations', attributes: ['id', 'name', 'country', 'image'] }],
    })

    res.json({ success: true, savedDestinations: updated.savedDestinations })
  } catch (err) { next(err) }
})

module.exports = router
