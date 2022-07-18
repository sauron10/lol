const { Pool,  Client } = require('pg')
const pool = new Pool({
  user : process.env.P_USER,
  password : process.env.P_PASSWORD,
  host : process.env.P_HOST,
  database : process.env.P_DATABASE,
  port : process.env.P_PORT
})

module.exports = {
  async query(text, params) {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', {duration, rows: res.rowCount })
    return res
  }
}
