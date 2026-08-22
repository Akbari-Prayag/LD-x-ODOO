const express = require('express')
const router  = express.Router()
const ctrl    = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth')

router.post('/register',        ctrl.register)
router.post('/login',           ctrl.login)
router.get('/me',         protect, ctrl.getMe)
router.post('/forgot-password', ctrl.forgotPassword)
router.post('/verify-reset-otp', ctrl.verifyResetOtp)
router.post('/reset-password', ctrl.resetPassword)

module.exports = router
