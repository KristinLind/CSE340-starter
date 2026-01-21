const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    const grid = await utilities.buildClassificationGrid(data.rows)
    const nav = await utilities.getNav()

    const className =
      data.rows[0]?.classification_name || "Vehicle Classification"

    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

invController.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryById(inv_id)

    if (!data.rows.length) {
      return res.status(404).send("Vehicle not found")
    }

    const vehicle = data.rows[0]

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = invController
