const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

const testConnection = async () => {
  try {
    const [rows] = await promisePool.query('SELECT 1');
    console.log('✅ Database connected successfully to rubber_molding_db');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Check your .env file DB credentials');
  }
};

module.exports = { promisePool, testConnection };
