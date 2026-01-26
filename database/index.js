const { Pool } = require("pg")
require("dotenv").config()

const isDev = process.env.NODE_ENV === "development"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // needed for Render-hosted Postgres
})

// Optional: log queries during development without changing the export shape
if (isDev) {
  const originalQuery = pool.query.bind(pool)
  pool.query = async (text, params) => {
    try {
      const res = await originalQuery(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  }
}

module.exports = pool
