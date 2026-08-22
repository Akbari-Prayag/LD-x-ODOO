/**
 * Central error handler middleware for Express & Sequelize.
 */
exports.errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message    = err.message    || 'Internal Server Error'

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400
    message    = err.errors.map(e => e.message).join(', ')
  }

  // Sequelize unique constraint error (e.g. duplicate email)
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400
    message    = err.errors.map(e => `${e.path} already exists`).join(', ')
  }

  // Sequelize database error / foreign key violation
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400
    message    = 'Referenced record does not exist'
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token' }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired' }

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * Not found handler
 */
exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
}
