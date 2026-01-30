const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

/* *******************************
 * PUBLIC INVENTORY ROUTES
 * ******************************* */
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

/* *******************************
 * MANAGEMENT ROUTES
 * ******************************* */
router.get("/", utilities.handleErrors(invController.buildManagement))

// Add Classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Add Classification (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Add Inventory (POST)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
