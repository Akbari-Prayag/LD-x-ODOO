const { Trip, TripStop, TripActivity, City, Activity, Expense } = require('../models')

/**
 * GET /api/trips
 */
exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: TripStop,
          as: 'stops',
          include: [{ model: City, as: 'city' }],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    res.json({ success: true, trips })
  } catch (err) { next(err) }
}

/**
 * GET /api/trips/:id
 */
exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
      include: [
        {
          model: TripStop,
          as: 'stops',
          include: [
            { model: City, as: 'city' },
            {
              model: TripActivity,
              as: 'activities',
              include: [{ model: Activity, as: 'activity' }],
            },
          ],
        },
        {
          model: Expense,
          as: 'expenses',
        },
      ],
      order: [
        [{ model: TripStop, as: 'stops' }, 'order', 'ASC'],
        [{ model: TripStop, as: 'stops' }, { model: TripActivity, as: 'activities' }, 'order', 'ASC'],
      ],
    })

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
      name,
      description: description || '',
      startDate,
      endDate,
      budget:      budget || 0,
      currency:    currency || 'INR',
      coverPhoto:  coverPhoto || '',
      tags:        tags || [],
      ownerId:     req.user.id,
    })

    res.status(201).json({ success: true, trip })
  } catch (err) { next(err) }
}

/**
 * PUT /api/trips/:id
 */
exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, ownerId: req.user.id } })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    await trip.update(req.body)
    res.json({ success: true, trip })
  } catch (err) { next(err) }
}

/**
 * DELETE /api/trips/:id
 */
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, ownerId: req.user.id } })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    await trip.destroy()
    res.json({ success: true, message: 'Trip deleted successfully' })
  } catch (err) { next(err) }
}

/**
 * POST /api/trips/:id/duplicate
 */
exports.duplicateTrip = async (req, res, next) => {
  try {
    const source = await Trip.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
      include: [
        {
          model: TripStop,
          as: 'stops',
          include: [{ model: TripActivity, as: 'activities' }],
        },
      ],
    })

    if (!source) return res.status(404).json({ success: false, message: 'Trip not found' })

    const newTrip = await Trip.create({
      name: `Copy of ${source.name}`,
      description: source.description,
      coverPhoto:  source.coverPhoto,
      startDate:   source.startDate,
      endDate:     source.endDate,
      budget:      source.budget,
      currency:    source.currency,
      tags:        source.tags,
      ownerId:     req.user.id,
    })

    // Duplicate stops & activities
    if (source.stops && source.stops.length > 0) {
      for (const stop of source.stops) {
        const newStop = await TripStop.create({
          tripId:                newTrip.id,
          cityId:                stop.cityId,
          customCityName:        stop.customCityName,
          arrivalDate:           stop.arrivalDate,
          departureDate:         stop.departureDate,
          notes:                 stop.notes,
          order:                 stop.order,
          accommodationName:     stop.accommodationName,
          accommodationAddress:  stop.accommodationAddress,
          accommodationCost:     stop.accommodationCost,
        })

        if (stop.activities && stop.activities.length > 0) {
          for (const act of stop.activities) {
            await TripActivity.create({
              tripStopId:        newStop.id,
              tripId:            newTrip.id,
              activityId:        act.activityId,
              customName:        act.customName,
              customDescription: act.customDescription,
              customCost:        act.customCost,
              scheduledDate:     act.scheduledDate,
              startTime:         act.startTime,
              endTime:           act.endTime,
              status:            'planned',
              order:             act.order,
            })
          }
        }
      }
    }

    res.status(201).json({ success: true, trip: newTrip })
  } catch (err) { next(err) }
}

/**
 * PATCH /api/trips/:id/publish
 */
exports.publishTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, ownerId: req.user.id } })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    trip.isPublic = !trip.isPublic
    await trip.save()

    res.json({ success: true, trip })
  } catch (err) { next(err) }
}
