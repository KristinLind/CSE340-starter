// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")

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
  try {
    const invId = req.params.invId
    const nav = await utilities.getNav()

    const vehicle = await invModel.getInventoryById(invId)
    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found." })
    }

    // IMPORTANT: this is already an array
    const reviews = await reviewModel.getReviewsByInvId(invId)

    const reviewHtml = utilities.buildReviewSection(
      reviews,
      invId,
      res.locals.loggedin,
      res.locals.accountData?.account_id,
      res.locals.accountData?.account_type
    )

    const detailHtml =
      utilities.buildVehicleDetail(vehicle) +
      reviewHtml

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHtml,
    })
  } catch (err) {
    next(err)
  }
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
 * Add Classification Process
 * ************************** */
invController.addClassification = async (req, res) => {
  const { classification_name } = req.body
  const nav = await utilities.getNav()

  // 1. Check if classification already existis
  const existing = await invModel.checkExistingClassification(classification_name)
  if (existing) {
    req.flash("notice", `The classification "${classification_name}" already exists.`)
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  }

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")
    const newNav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList() 

    return res.render("inventory/management", {
      title: "Vehicle Management",
      nav: newNav,
      classificationSelect,
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

/* ***************************
 * Add Inventory Process
 * ************************** */
invController.addInventory = async (req, res) => {
  const nav = await utilities.getNav()
  
  // 2. SERVER-SIDE VALIDATION 
  const { inv_miles, inv_price } = req.body
  if (parseFloat(inv_miles) < 0 || parseFloat(inv_price) < 0) {
    req.flash("notice", "Mileage and Price must be positive numbers.")
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...req.body,
    })
  }

  const result = await invModel.addInventory(req.body)

  if (result) {
    req.flash("notice", "Inventory item added successfully.")
    const newNav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    return res.render("inventory/management", {
      title: "Vehicle Management",
      nav: newNav,
      classificationSelect, 
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
 * Additional handlers (Edit/Update/Delete)
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
    ...itemData
  })
}

invController.updateInventory = async (req, res, next) => {
  const nav = await utilities.getNav()
  const result = await invModel.updateInventory(req.body)

  if (result) {
    req.flash("notice", "The vehicle was successfully updated.")
    return res.redirect("/inv/")
  }

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

invController.buildDeleteView = async (req, res, next) => {
  const invId = parseInt(req.params.invId)
  const nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(invId)
  if (!itemData) return next({ status: 404, message: "Inventory item not found." })

  res.render("inventory/delete-confirm", {
    title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    errors: null,
    ...itemData
  })
}

invController.deleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", "Vehicle successfully deleted.")
    return res.redirect("/inv/")
  }

  req.flash("notice", "Sorry, the delete failed.")
  return res.redirect("/inv/")
}

invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  const data = invData.rows ?? invData

  if (data && data.length > 0) {
    return res.json(data)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invController
