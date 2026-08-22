const { Op } = require('sequelize')
const { City, Activity } = require('../models')

/**
 * GET /api/cities
 */
exports.getCities = async (req, res, next) => {
  try {
    const {
      search, country, region, minCost, maxCost,
      sortBy = 'popularity', order = 'desc',
      page = 1, limit = 20,
    } = req.query

    const where = { isActive: true }

    if (search) {
      where[Op.or] = [
        { name:        { [Op.like]: `%${search}%` } },
        { country:     { [Op.like]: `%${search}%` } },
        { region:      { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ]
    }
    if (country) where.country = { [Op.like]: `%${country}%` }
    if (region)  where.region  = { [Op.like]: `%${region}%` }
    if (minCost || maxCost) {
      where.costIndex = {}
      if (minCost) where.costIndex[Op.gte] = Number(minCost)
      if (maxCost) where.costIndex[Op.lte] = Number(maxCost)
    }

    const sortMap = { popularity: 'popularity', name: 'name', cost: 'costIndex' }
    const sortField = sortMap[sortBy] || 'popularity'
    const sortDir   = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const pageNum  = Math.max(1, parseInt(page, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)))
    const offset   = (pageNum - 1) * limitNum

    const { count, rows: cities } = await City.findAndCountAll({
      where,
      order:  [[sortField, sortDir]],
      limit:  limitNum,
      offset,
    })

    res.json({
      success: true,
      cities,
      total:      count,
      page:       pageNum,
      totalPages: Math.ceil(count / limitNum),
    })
  } catch (err) { next(err) }
}

/**
 * GET /api/cities/:id
 */
exports.getCity = async (req, res, next) => {
  try {
    const city = await City.findByPk(req.params.id, {
      include: [{ model: Activity, as: 'activities' }],
    })
    if (!city) return res.status(404).json({ success: false, message: 'City not found' })
    res.json({ success: true, city })
  } catch (err) { next(err) }
}

/**
 * GET /api/cities/popular
 */
exports.getPopularCities = async (req, res, next) => {
  try {
    const cities = await City.findAll({
      where: { isActive: true },
      order: [['popularity', 'DESC']],
      limit: 12,
    })
    res.json({ success: true, cities })
  } catch (err) { next(err) }
}
