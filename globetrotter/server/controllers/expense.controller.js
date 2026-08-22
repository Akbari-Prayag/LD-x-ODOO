const Expense = require('../models/Expense')
const Trip    = require('../models/Trip')

/**
 * GET /api/expenses/trip/:tripId
 */
exports.getTripExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.params

    // Verify ownership
    const trip = await Trip.findOne({ _id: tripId, owner: req.user._id })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    const expenses = await Expense.find({ trip: tripId }).sort({ date: -1 })

    // Calculate summary
    const total = expenses.reduce((sum, e) => sum + e.amount, 0)
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
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

    const trip = await Trip.findOne({ _id: tripId, owner: req.user._id })
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' })

    const expense = await Expense.create({
      trip:        tripId,
      tripStop:    tripStopId,
      user:        req.user._id,
      description,
      amount:      Number(amount),
      category,
      date:        date || new Date(),
      notes,
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
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id })
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' })

    const oldAmount = expense.amount
    Object.assign(expense, req.body)
    await expense.save()

    // Recalculate trip totalSpent
    const trip = await Trip.findById(expense.trip)
    if (trip) {
      trip.totalSpent = (trip.totalSpent || 0) - oldAmount + expense.amount
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
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' })

    const trip = await Trip.findById(expense.trip)
    if (trip) {
      trip.totalSpent = Math.max(0, (trip.totalSpent || 0) - expense.amount)
      await trip.save()
    }

    res.json({ success: true, message: 'Expense deleted' })
  } catch (err) { next(err) }
}
