const { Expense, Trip } = require('../models')

/**
 * GET /api/expenses/trip/:tripId
 */
exports.getTripExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.params

    const trip = await Trip.findOne({ where: { id: tripId, ownerId: req.user.id } })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    const expenses = await Expense.findAll({
      where: { tripId },
      order: [['date', 'DESC']],
    })

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
      return acc
    }, {})

    res.json({ success: true, expenses, summary: { total, byCategory } })
  } catch (err) { next(err) }
}

/**
 * POST /api/expenses
 */
exports.createExpense = async (req, res, next) => {
  try {
    const { tripId, description, amount, category, date, notes, tripStopId } = req.body

    const trip = await Trip.findOne({ where: { id: tripId, ownerId: req.user.id } })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    const expense = await Expense.create({
      tripId,
      tripStopId:  tripStopId || null,
      userId:      req.user.id,
      description,
      amount:      Number(amount),
      category,
      date:        date || new Date(),
      notes:       notes || '',
      currency:    trip.currency,
    })

    // Update trip totalSpent
    trip.totalSpent = (trip.totalSpent || 0) + Number(amount)
    await trip.save()

    res.status(201).json({ success: true, expense })
  } catch (err) { next(err) }
}

/**
 * PUT /api/expenses/:id
 */
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, userId: req.user.id } })
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' })

    const oldAmount = expense.amount
    await expense.update(req.body)

    const trip = await Trip.findByPk(expense.tripId)
    if (trip) {
      trip.totalSpent = (trip.totalSpent || 0) - oldAmount + Number(expense.amount)
      await trip.save()
    }

    res.json({ success: true, expense })
  } catch (err) { next(err) }
}

/**
 * DELETE /api/expenses/:id
 */
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, userId: req.user.id } })
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' })

    const tripId = expense.tripId
    const amount = expense.amount
    await expense.destroy()

    const trip = await Trip.findByPk(tripId)
    if (trip) {
      trip.totalSpent = Math.max(0, (trip.totalSpent || 0) - amount)
      await trip.save()
    }

    res.json({ success: true, message: 'Expense deleted' })
  } catch (err) { next(err) }
}
