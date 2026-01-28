const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")


// Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/", utilities.handleErrors(accountController.buildLogin))

// Deliver registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration (with server-side validation)
router.post(
  "/register",
  accountValidate.validateRegistration(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process login (with server-side validation)
router.post(
  "/login",
  accountValidate.validateLogin(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router

