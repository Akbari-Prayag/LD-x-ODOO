const { Op } = require('sequelize')
const { Activity, City } = require('../models')

/**
 * GET /api/activities
 */
exports.getActivities = async (req, res, next) => {
  try {
    const {
      search, category, cityId, minCost, maxCost,
      duration, sortBy = 'rating', page = 1, limit = 20,
    } = req.query

    const where = { isActive: true }

    if (search) {
      where[Op.or] = [
        { name:        { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ]
    }
    if (category) where.category = category
    if (cityId)   where.cityId   = cityId
    if (minCost || maxCost) {
      where.estimatedCost = {}
      if (minCost) where.estimatedCost[Op.gte] = Number(minCost)
      if (maxCost) where.estimatedCost[Op.lte] = Number(maxCost)
    }
    if (duration) where.durationValue = { [Op.lte]: Number(duration) }

    const sortMap = { rating: 'ratingAverage', cost: 'estimatedCost', name: 'name' }
    const sortField = sortMap[sortBy] || 'ratingAverage'

    const pageNum  = Math.max(1, parseInt(page, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)))
    const offset   = (pageNum - 1) * limitNum

    const { count, rows: activities } = await Activity.findAndCountAll({
      where,
      include: [{ model: City, as: 'city', attributes: ['id', 'name', 'country'] }],
      order:   [[sortField, 'DESC']],
      limit:   limitNum,
      offset,
    })

    res.json({
      success: true,
      activities,
      total:      count,
      page:       pageNum,
      totalPages: Math.ceil(count / limitNum),
    })
  } catch (err) { next(err) }
}

/**
 * GET /api/activities/city/:cityId
 */
exports.getActivitiesByCity = async (req, res, next) => {
  try {
    const activities = await Activity.findAll({
      where: { cityId: req.params.cityId, isActive: true },
      order: [['ratingAverage', 'DESC']],
    })
    res.json({ success: true, activities })
  } catch (err) { next(err) }
}

/**
 * GET /api/activities/:id
 */
exports.getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      include: [{ model: City, as: 'city' }],
    })
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' })
    res.json({ success: true, activity })
  } catch (err) { next(err) }
}
