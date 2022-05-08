const { Pool,  Client } = require('pg')
const pool = new Pool({
  user : 'heivagar',
  password : '20205061',
  host : 'localhost',
  database : 'lol_db',
  port : 5432
})

module.exports = {
  async query(text, params) {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
  }
}