const express = require('express')
const router  = express.Router()
const ctrl    = require('../controllers/city.controller')
const { protect } = require('../middleware/auth')

router.get('/popular',  ctrl.getPopularCities)
router.get('/',         ctrl.getCities)
router.get('/:id',      ctrl.getCity)

module.exports = router
