const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")
const validate = {}

/* ***************************
 * Classification rules
 * *************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters."),
  ]
}

/* ***************************
 * Check classification data
 * *************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name,
    })
  }
  next()
}

/* ***************************
 * Inventory rules (used for add AND update)
 * *************************** */
validate.inventoryRules = () => {
  return [
    body("inv_id").optional().isInt().withMessage("Invalid inventory id."),
    body("classification_id")
      .notEmpty().withMessage("Please choose a classification.")
      .isInt().withMessage("Classification must be a valid ID."),
    body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("Year must be a valid 4-digit year."),
    body("inv_description").trim().escape().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").trim().isNumeric().withMessage("Price must be a valid number with no symbols or commas."),
    body("inv_miles").trim().isInt().withMessage("Miles must be digits only."),
    body("inv_color").trim().escape().notEmpty().withMessage("Color is required."),
  ]
}

/* ***************************
 * Check ADD inventory data
 * *************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }
  next()
}

/* ***************************
 * Check UPDATE inventory data
 * *************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
  } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    return res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      errors: errors.array(),
      ...req.body, 
    })
  }
  next()
}

module.exports = validate

