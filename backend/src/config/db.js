const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Connected to Homebuild database successfully'))
  .catch((err) => console.error('Database connection error:', err));

module.exports = pool;