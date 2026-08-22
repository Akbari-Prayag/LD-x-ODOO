const Activity = require('../models/Activity')

/**
 * GET /api/activities
 */
exports.getActivities = async (req, res, next) => {
  try {
    const {
      search, category, cityId, minCost, maxCost,
      duration, sortBy = 'rating', page = 1, limit = 20,
    } = req.query

    const filter = { isActive: true }

    if (search)   filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
    if (category) filter.category = category
    if (cityId)   filter.city = cityId
    if (minCost)  filter.estimatedCost = { ...filter.estimatedCost, $gte: Number(minCost) }
    if (maxCost)  filter.estimatedCost = { ...filter.estimatedCost, $lte: Number(maxCost) }
    if (duration) filter['duration.value'] = { $lte: Number(duration) }

    const sortMap = { rating: 'rating.average', cost: 'estimatedCost', name: 'name' }
    const sortField = sortMap[sortBy] || 'rating.average'

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Activity.countDocuments(filter)

    const activities = await Activity.find(filter)
      .populate('city', 'name country')
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({
      success: true,
      activities,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    })
  } catch (err) { next(err) }
}

/**
 * GET /api/activities/city/:cityId
 */
exports.getActivitiesByCity = async (req, res, next) => {
  try {
    const activities = await Activity.find({ city: req.params.cityId, isActive: true })
      .sort({ 'rating.average': -1 })
    res.json({ success: true, activities })
  } catch (err) { next(err) }
}

/**
 * GET /api/activities/:id
 */
exports.getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('city', 'name country')
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' })
    res.json({ success: true, activity })
  } catch (err) { next(err) }
}
