const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// PUBLIC ROUTES - No authorization needed (visitors can view)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

// PROTECTED ROUTES - Employee/Admin only
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
)

router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:invId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
)

router.post(
  "/update",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Deliver delete confirmation view
router.get(
  "/delete/:invId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteView)
)

// Process the delete
router.post(
  "/delete",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router

