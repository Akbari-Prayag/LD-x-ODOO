const express = require('express')
const router  = express.Router()
const ctrl    = require('../controllers/trip.controller')
const { protect } = require('../middleware/auth')

router.use(protect)  // All trip routes require auth

router.route('/')
  .get(ctrl.getTrips)
  .post(ctrl.createTrip)

router.route('/:id')
  .get(ctrl.getTrip)
  .put(ctrl.updateTrip)
  .delete(ctrl.deleteTrip)

router.post('/:id/duplicate', ctrl.duplicateTrip)
router.patch('/:id/publish',  ctrl.publishTrip)

module.exports = router
