const { Sequelize } = require('sequelize')
const mysql = require('mysql2/promise')
require('dotenv').config()

const DB_HOST     = process.env.DB_HOST     || 'localhost'
const DB_PORT     = process.env.DB_PORT     || 3306
const DB_USER     = process.env.DB_USER     || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME     = process.env.DB_NAME     || 'globetrotter'

// Ensure database exists before Sequelize connects
async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({
      host:     DB_HOST,
      port:     DB_PORT,
      user:     DB_USER,
      password: DB_PASSWORD,
    })
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`)
    await connection.end()
  } catch (err) {
    console.warn('⚠️ Could not auto-create database (check MySQL credentials):', err.message)
  }
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host:    DB_HOST,
  port:    DB_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? false : false, // set to console.log for SQL logs
  pool: {
    max:     10,
    min:     0,
    acquire: 30000,
    idle:    10000,
  },
  define: {
    timestamps: true,
    underscored: false,
  },
})

module.exports = {
  sequelize,
  ensureDatabaseExists,
}
