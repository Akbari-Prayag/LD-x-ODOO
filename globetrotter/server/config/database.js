const { Sequelize } = require('sequelize')
const mysql = require('mysql2/promise')
require('dotenv').config()

const DB_HOST     = process.env.DB_HOST     || 'localhost'
const DB_PORT     = parseInt(process.env.DB_PORT, 10) || 3306
const DB_USER     = process.env.DB_USER     || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME     = process.env.DB_NAME     || 'globetrotter'
const DB_SSL      = process.env.DB_SSL === 'true' || DB_PORT === 4000

// Ensure database exists before Sequelize connects
async function ensureDatabaseExists() {
  // If using managed cloud database, database is typically pre-created
  try {
    const connConfig = {
      host:     DB_HOST,
      port:     DB_PORT,
      user:     DB_USER,
      password: DB_PASSWORD,
    }
    if (DB_SSL) {
      connConfig.ssl = { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    }

    const connection = await mysql.createConnection(connConfig)
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`)
    await connection.end()
  } catch (err) {
    // If user has restricted permissions to create DB, log and continue
    console.log('ℹ️ Checking database connection...')
  }
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host:    DB_HOST,
  port:    DB_PORT,
  dialect: 'mysql',
  dialectOptions: DB_SSL ? {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  } : {},
  logging: false,
  pool: {
    max:     10,
    min:     0,
    acquire: 30000,
    idle:    10000,
  },
  define: {
    timestamps:  true,
    underscored: false,
  },
})

module.exports = {
  sequelize,
  ensureDatabaseExists,
}
