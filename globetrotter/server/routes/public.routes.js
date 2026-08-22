const express = require('express')
const router  = express.Router()
const ctrl    = require('../controllers/public.controller')
const { protect } = require('../middleware/auth')

router.get('/trip/:slug',        ctrl.getPublicTrip)
router.post('/trip/:slug/copy',  protect, ctrl.copyPublicTrip)

module.exports = router
