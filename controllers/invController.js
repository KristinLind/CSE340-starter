// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

invController.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId

  // get inventory rows for that classification
  const data = await invModel.getInventoryByClassificationId(classificationId)

  // build the HTML grid
  const grid = await utilities.buildClassificationGrid(data.rows)

  // classification name for title
  const className = data.rows[0]?.classification_name || "Vehicles"

  res.render("inventory/classification", {
    title: className,
    grid,
  })
}

invController.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId
  const vehicle = await invModel.getInventoryById(invId)

  if (!vehicle) {
    return next({ status: 404, message: "Vehicle not found." })
  }

  const title = `${vehicle.inv_make} ${vehicle.inv_model}`
  const detailHtml = utilities.buildVehicleDetail(vehicle)

  res.render("inventory/detail", { title, detailHtml })
}

module.exports = invController
