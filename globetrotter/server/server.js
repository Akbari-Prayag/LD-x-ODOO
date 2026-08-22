require('dotenv').config()
const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
const helmet   = require('helmet')
const morgan   = require('morgan')
const path     = require('path')

const authRoutes       = require('./routes/auth.routes')
const userRoutes       = require('./routes/user.routes')
const tripRoutes       = require('./routes/trip.routes')
const cityRoutes       = require('./routes/city.routes')
const activityRoutes   = require('./routes/activity.routes')
const expenseRoutes    = require('./routes/expense.routes')
const publicRoutes     = require('./routes/public.routes')
const adminRoutes      = require('./routes/admin.routes')
const { errorHandler } = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Security & Middleware ───────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Static uploads ──────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/users',      userRoutes)
app.use('/api/trips',      tripRoutes)
app.use('/api/cities',     cityRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/expenses',   expenseRoutes)
app.use('/api/public',     publicRoutes)
app.use('/api/admin',      adminRoutes)

// ─── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Global error handler ─────────────────────────────────────
app.use(errorHandler)

// ─── Database + Start ────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })

module.exports = app
