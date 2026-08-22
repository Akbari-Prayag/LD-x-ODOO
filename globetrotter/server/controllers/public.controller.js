const { Trip, TripStop, TripActivity, City, Activity, User } = require('../models')

/**
 * GET /api/public/trip/:slug
 */
exports.getPublicTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      where: { publicSlug: req.params.slug, isPublic: true },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'avatar'],
        },
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
      ],
      order: [
        [{ model: TripStop, as: 'stops' }, 'order', 'ASC'],
        [{ model: TripStop, as: 'stops' }, { model: TripActivity, as: 'activities' }, 'order', 'ASC'],
      ],
    })

    if (!trip) return res.status(404).json({ success: false, message: 'Public trip not found' })
    res.json({ success: true, trip })
  } catch (err) { next(err) }
}

/**
 * POST /api/public/trip/:slug/copy
 */
exports.copyPublicTrip = async (req, res, next) => {
  try {
    const source = await Trip.findOne({
      where: { publicSlug: req.params.slug, isPublic: true },
      include: [
        {
          model: TripStop,
          as: 'stops',
          include: [{ model: TripActivity, as: 'activities' }],
        },
      ],
    })

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
      ownerId:     req.user.id,
    })

    // Duplicate stops & activities
    if (source.stops && source.stops.length > 0) {
      for (const stop of source.stops) {
        const newStop = await TripStop.create({
          tripId:                copy.id,
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
              tripId:            copy.id,
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

    res.status(201).json({ success: true, trip: copy })
  } catch (err) { next(err) }
}
