const express = require('express')
const router  = express.Router()
const { Sequelize } = require('sequelize')
const { User, Trip, City, Activity } = require('../models')
const { protect, restrictTo } = require('../middleware/auth')

router.use(protect, restrictTo('admin'))

/**
 * GET /api/admin/stats
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [totalUsers, totalTrips, totalCities, totalActivities] = await Promise.all([
      User.count({ where: { isActive: true } }),
      Trip.count(),
      City.count({ where: { isActive: true } }),
      Activity.count({ where: { isActive: true } }),
    ])

    const recentTrips = await Trip.findAll({
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
      order:   [['createdAt', 'DESC']],
      limit:   10,
    })

    const popularCities = await City.findAll({
      where: { isActive: true },
      order: [['popularity', 'DESC']],
      limit: 8,
    })

    const tripsByStatus = await Trip.findAll({
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group:      ['status'],
    })

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
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50,
    })
    res.json({ success: true, users: users.map(u => u.toSafeJSON()) })
  } catch (err) { next(err) }
})

module.exports = router
