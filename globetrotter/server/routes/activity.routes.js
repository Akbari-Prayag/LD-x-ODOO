const express = require('express')
const router  = express.Router()
const ctrl    = require('../controllers/activity.controller')

router.get('/city/:cityId', ctrl.getActivitiesByCity)
router.get('/',             ctrl.getActivities)
router.get('/:id',          ctrl.getActivity)

module.exports = router
