const pool = require("../database/")

/* ***************************
 * Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

/* ***************************
 * Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const data = await pool.query(sql, [classification_name])
    return data.rowCount > 0 // Returns true if a match is found
  } catch (error) {
    return false
  }
}

/* ***************************
 * Get all inventory items for a classification_id
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

/* ***************************
 * Get one inventory item by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* ***************************
 * Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING *
    `
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    return null
  }
}

/* ***************************
 * Add new inventory item
 * ************************** */
async function addInventory(invData) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `
    const params = [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id,
    ]

    const data = await pool.query(sql, params)
    return data.rows[0]
  } catch (error) {
    return null
  }
}

/* ***************************
 * Update inventory item
 * ************************** */
async function updateInventory(invData) {
  try {
    const sql = `
      UPDATE public.inventory
      SET inv_make = $1,
          inv_model = $2,
          inv_year = $3,
          inv_description = $4,
          inv_image = $5,
          inv_thumbnail = $6,
          inv_price = $7,
          inv_miles = $8,
          inv_color = $9,
          classification_id = $10
      WHERE inv_id = $11
      RETURNING *
    `

    const params = [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id,
      invData.inv_id,
    ]

    const data = await pool.query(sql, params)
    return data.rows[0]
  } catch (error) {
    return null
  }
}

/* ***************************
 * Delete inventory item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data.rowCount
  } catch (error) {
    return null
  }
}

module.exports = {
  getClassifications,
  checkExistingClassification, // Added to exports
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
}



