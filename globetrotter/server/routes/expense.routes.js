const express = require('express')
const router  = express.Router()
const ctrl    = require('../controllers/expense.controller')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/trip/:tripId', ctrl.getTripExpenses)
router.post('/',            ctrl.createExpense)
router.put('/:id',          ctrl.updateExpense)
router.delete('/:id',       ctrl.deleteExpense)

module.exports = router
