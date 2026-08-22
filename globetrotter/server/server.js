require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const morgan  = require('morgan')
const path    = require('path')

const { sequelize, ensureDatabaseExists } = require('./config/database')
require('./models') // loads models & associations

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
  res.json({ status: 'ok', database: 'mysql', timestamp: new Date().toISOString() })
})

// ─── Global error handler ─────────────────────────────────────
app.use(errorHandler)

// ─── Database + Start ────────────────────────────────────────
async function startServer() {
  try {
    // 1. Ensure database exists
    await ensureDatabaseExists()

    // 2. Authenticate Sequelize
    await sequelize.authenticate()
    console.log('✅ MySQL connected successfully')

    // 3. Sync tables
    await sequelize.sync({ alter: true })
    console.log('✅ MySQL tables synchronized')

    // 4. Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message)
    console.error('👉 Please ensure MySQL service is running and check your .env credentials (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME).')
    process.exit(1)
  }
}

startServer()

module.exports = app
