const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// classification listing
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// vehicle detail
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

module.exports = router
