const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    const grid = utilities.buildClassificationGrid(data.rows)

    const className =
      data.rows[0]?.classification_name || "Vehicle Classification"

    res.render("inventory/classification", {
      title: className,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = invController
