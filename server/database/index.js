const { Pool } = require('pg')

const pool = new Pool({
  user: 'major',
  host: 'localhost',
  database: 'major',
  password: 'major',
  port: 5432,
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}