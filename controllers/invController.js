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
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    pageClass: "inv-management"
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
    ...req.body, // keeps stickiness if DB insert fails
  })
}

module.exports = invController
