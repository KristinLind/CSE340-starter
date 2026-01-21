const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

/* ***************************
 *  Get all inventory items for a classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
      ORDER BY i.inv_make, i.inv_model
    `
    return await pool.query(sql, [classification_id])
  } catch (error) {
    throw error
  }
}
async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `
    return await pool.query(sql, [inv_id])
  } catch (error) {
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
}

