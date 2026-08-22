const City = require('../models/City')

/**
 * GET /api/cities
 * Supports: search, country, region, minCost, maxCost, sortBy, page, limit
 */
exports.getCities = async (req, res, next) => {
  try {
    const {
      search, country, region, minCost, maxCost,
      sortBy = 'popularity', order = 'desc',
      page = 1, limit = 20,
    } = req.query

    const filter = { isActive: true }

    if (search) {
      filter.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { region:  { $regex: search, $options: 'i' } },
      ]
    }
    if (country) filter.country = { $regex: country, $options: 'i' }
    if (region)  filter.region  = { $regex: region,  $options: 'i' }
    if (minCost) filter.costIndex = { ...filter.costIndex, $gte: Number(minCost) }
    if (maxCost) filter.costIndex = { ...filter.costIndex, $lte: Number(maxCost) }

    const sortMap = { popularity: 'popularity', name: 'name', cost: 'costIndex' }
    const sortField = sortMap[sortBy] || 'popularity'
    const sortDir   = order === 'asc' ? 1 : -1

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await City.countDocuments(filter)

    const cities = await City.find(filter)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(Number(limit))

    res.json({
      success: true,
      cities,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    })
  } catch (err) { next(err) }
}

/**
 * GET /api/cities/:id
 */
exports.getCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id)
    if (!city) return res.status(404).json({ success: false, message: 'City not found' })
    res.json({ success: true, city })
  } catch (err) { next(err) }
}

/**
 * GET /api/cities/popular
 */
exports.getPopularCities = async (req, res, next) => {
  try {
    const cities = await City.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(12)
    res.json({ success: true, cities })
  } catch (err) { next(err) }
}
