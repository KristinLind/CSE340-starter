const pool = require("../database/")

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account
        (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES
        ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("❌ registerAccount DB error:", error.message)
    throw error
  }
}

/* *****************************
 *   Get account by email
 * *************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id,
             account_firstname,
             account_lastname,
             account_email,
             account_type,
             account_password
      FROM account
      WHERE account_email = $1
    `
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("❌ getAccountByEmail DB error:", error.message)
    throw error
  }
}

/* *****************************
 *   Get account by ID
 * *************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id,
             account_firstname,
             account_lastname,
             account_email,
             account_type,
             account_password
      FROM account
      WHERE account_id = $1
    `
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("❌ getAccountById DB error:", error.message)
    throw error
  }
}

/* *****************************
 *   Update account information
 * *************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return result.rows[0]
  } catch (error) {
    console.error("❌ updateAccount DB error:", error.message)
    throw error
  }
}

/* *****************************
 *   Update password
 * *************************** */
async function updatePassword(account_password, account_id) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *
    `
    const result = await pool.query(sql, [account_password, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("❌ updatePassword DB error:", error.message)
    throw error
  }
}

module.exports = { 
  registerAccount, 
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
}
