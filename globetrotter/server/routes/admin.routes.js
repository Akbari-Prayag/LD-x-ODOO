const express  = require('express')
const router   = express.Router()
const User     = require('../models/User')
const Trip     = require('../models/Trip')
const City     = require('../models/City')
const Activity = require('../models/Activity')
const { protect, restrictTo } = require('../middleware/auth')

router.use(protect, restrictTo('admin'))

/**
 * GET /api/admin/stats
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [totalUsers, totalTrips, totalCities, totalActivities] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Trip.countDocuments(),
      City.countDocuments({ isActive: true }),
      Activity.countDocuments({ isActive: true }),
    ])

    const recentTrips = await Trip.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)

    const popularCities = await City.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(8)

    const tripsByStatus = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    res.json({
      success: true,
      stats: { totalUsers, totalTrips, totalCities, totalActivities },
      recentTrips,
      popularCities,
      tripsByStatus,
    })
  } catch (err) { next(err) }
})

/**
 * GET /api/admin/users
 */
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, users: users.map(u => u.toSafeJSON()) })
  } catch (err) { next(err) }
})

module.exports = router
