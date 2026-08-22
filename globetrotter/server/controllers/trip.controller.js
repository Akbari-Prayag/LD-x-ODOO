const Trip     = require('../models/Trip')
const TripStop = require('../models/TripStop')
const Expense  = require('../models/Expense')

/**
 * GET /api/trips
 */
exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ owner: req.user._id })
      .populate('stops')
      .sort({ createdAt: -1 })

    res.json({ success: true, trips })
  } catch (err) { next(err) }
}

/**
 * GET /api/trips/:id
 */
exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, owner: req.user._id })
      .populate({ path: 'stops', populate: { path: 'city activities', populate: { path: 'activity' } } })

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })
    res.json({ success: true, trip })
  } catch (err) { next(err) }
}

/**
 * POST /api/trips
 */
exports.createTrip = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, budget, currency, coverPhoto, tags } = req.body

    const trip = await Trip.create({
      name, description, startDate, endDate,
      budget: budget || 0,
      currency: currency || 'INR',
      coverPhoto: coverPhoto || '',
      tags: tags || [],
      owner: req.user._id,
    })

    res.status(201).json({ success: true, trip })
  } catch (err) { next(err) }
}

/**
 * PUT /api/trips/:id
 */
exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('stops')

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })
    res.json({ success: true, trip })
  } catch (err) { next(err) }
}

/**
 * DELETE /api/trips/:id
 */
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    // Cascade delete stops and expenses
    await TripStop.deleteMany({ trip: trip._id })
    await Expense.deleteMany({ trip: trip._id })

    res.json({ success: true, message: 'Trip deleted successfully' })
  } catch (err) { next(err) }
}

/**
 * POST /api/trips/:id/duplicate
 */
exports.duplicateTrip = async (req, res, next) => {
  try {
    const source = await Trip.findOne({ _id: req.params.id, owner: req.user._id })
      .populate('stops')

    if (!source) return res.status(404).json({ success: false, message: 'Trip not found' })

    const newTrip = await Trip.create({
      name:        `Copy of ${source.name}`,
      description: source.description,
      coverPhoto:  source.coverPhoto,
      startDate:   source.startDate,
      endDate:     source.endDate,
      budget:      source.budget,
      currency:    source.currency,
      tags:        source.tags,
      owner:       req.user._id,
    })

    res.status(201).json({ success: true, trip: newTrip })
  } catch (err) { next(err) }
}

/**
 * PATCH /api/trips/:id/publish
 */
exports.publishTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, owner: req.user._id })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    trip.isPublic = !trip.isPublic
    await trip.save()

    res.json({ success: true, trip })
  } catch (err) { next(err) }
}
