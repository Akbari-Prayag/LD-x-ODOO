const Trip = require('../models/Trip')

/**
 * GET /api/public/trip/:slug
 * No auth required – read-only public trip view
 */
exports.getPublicTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ publicSlug: req.params.slug, isPublic: true })
      .populate('owner', 'name avatar')
      .populate({
        path:     'stops',
        populate: {
          path:    'city activities',
          populate: { path: 'activity' },
        },
      })

    if (!trip) return res.status(404).json({ success: false, message: 'Public trip not found' })
    res.json({ success: true, trip })
  } catch (err) { next(err) }
}

/**
 * POST /api/public/trip/:slug/copy
 * Auth required – copy a public trip to the authenticated user's trips
 */
exports.copyPublicTrip = async (req, res, next) => {
  try {
    const source = await Trip.findOne({ publicSlug: req.params.slug, isPublic: true })
    if (!source) return res.status(404).json({ success: false, message: 'Public trip not found' })

    const copy = await Trip.create({
      name:        `${source.name} (copied)`,
      description: source.description,
      coverPhoto:  source.coverPhoto,
      startDate:   source.startDate,
      endDate:     source.endDate,
      budget:      source.budget,
      currency:    source.currency,
      tags:        source.tags,
      owner:       req.user._id,
    })

    res.status(201).json({ success: true, trip: copy })
  } catch (err) { next(err) }
}
