// models/review-model.js
const pool = require("../database")

/* ***************************
 * Add a new vehicle review
 * ************************** */
async function addReview(inv_id, account_id, rating, review_text) {
  try {
    const sql = `
      INSERT INTO vehicle_reviews (inv_id, account_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await pool.query(sql, [
      inv_id,
      account_id,
      rating,
      review_text,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error:", error)
    throw error
  }
}

/* ***************************
 * Get reviews by vehicle ID
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id,
             r.inv_id,
             r.account_id,
             r.rating,
             r.review_text,
             r.created_at,
             a.account_firstname
      FROM vehicle_reviews r
      JOIN account a
        ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.created_at DESC
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByInvId error:", error)
    throw error
  }
}

/* ***************************
 * Get review by ID
 * ************************** */
async function getReviewById(review_id) {
  const sql = `
    SELECT *
    FROM vehicle_reviews
    WHERE review_id = $1
  `
  const result = await pool.query(sql, [review_id])
  return result.rows[0]
}

/* ***************************
 * Delete review by ID
 * ************************** */
async function deleteReview(review_id) {
  const sql = `
    DELETE FROM vehicle_reviews
    WHERE review_id = $1
    RETURNING *
  `
  const result = await pool.query(sql, [review_id])
  return result.rowCount
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getReviewById,
  deleteReview
}
