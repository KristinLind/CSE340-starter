// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

invController.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId

  const nav = await utilities.getNav()
  const data = await invModel.getInventoryByClassificationId(classificationId)
  const grid = await utilities.buildClassificationGrid(data.rows)
  const className = data.rows[0]?.classification_name || "Vehicles"

  res.render("inventory/classification", {
    title: className,
    nav,
    grid,
  })
}

invController.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId

  const nav = await utilities.getNav()
  const vehicle = await invModel.getInventoryById(invId)

  if (!vehicle) return next({ status: 404, message: "Vehicle not found." })

  const title = `${vehicle.inv_make} ${vehicle.inv_model}`
  const detailHtml = utilities.buildVehicleDetail(vehicle)

  res.render("inventory/detail", {
    title,
    nav,
    detailHtml,
  })
}

invController.buildManagement = async (req, res) => {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null,
    pageClass: "inv-management",
  })
}

invController.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
    pageClass: "inv-form",
  })
}

invController.buildAddInventory = async (req, res) => {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    // sticky defaults:
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  })
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.buildEditInventory = async (req, res, next) => {
  const invId = parseInt(req.params.invId)
  const nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(invId)
  if (!itemData) return next({ status: 404, message: "Inventory item not found." })

  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/edit-inventory", {
    title: `Edit ${itemName}`,
    nav,
    classificationSelect,
    errors: null,

    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

invController.addClassification = async (req, res) => {
  const nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")
    const newNav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Vehicle Management",
      nav: newNav,
      errors: null,
    })
  }

  req.flash("notice", "Sorry, the classification could not be added.")
  return res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name,
  })
}

invController.addInventory = async (req, res) => {
  const nav = await utilities.getNav()
  const result = await invModel.addInventory(req.body)

  if (result) {
    req.flash("notice", "Inventory item added successfully.")
    const newNav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Vehicle Management",
      nav: newNav,
      errors: null,
    })
  }

  req.flash("notice", "Sorry, the inventory item could not be added.")
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)
  return res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    ...req.body,
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)

  const data = invData.rows ?? invData

  if (data && data.length > 0 && data[0].inv_id) {
    return res.json(data)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Process inventory update
 * ************************** */
invController.updateInventory = async (req, res, next) => {
  const nav = await utilities.getNav()

  // inv_id MUST come from the hidden input in edit-inventory.ejs
  const inv_id = parseInt(req.body.inv_id)

  const result = await invModel.updateInventory(req.body)

  if (result) {
    req.flash("notice", "The vehicle was successfully updated.")
    return res.redirect("/inv/")
  }

  // If update failed, rebuild dropdown + re-render edit form with sticky values
  req.flash("notice", "Sorry, the update failed.")
  const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)

  return res.render("inventory/edit-inventory", {
    title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
    nav,
    classificationSelect,
    errors: null,
    ...req.body,
  })
}

module.exports = invController

