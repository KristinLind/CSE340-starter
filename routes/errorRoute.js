const express = require("express")
const router = new express.Router()
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")

router.get(
  "/trigger-error",
  utilities.handleErrors(baseController.triggerError)
)

module.exports = router
