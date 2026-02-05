const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")


// Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Deliver account management view (default account route)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Deliver registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.get("/logout", utilities.handleErrors(async (req, res) => {
    res.clearCookie("jwt")
    req.flash("notice", "You have been logged out.")
    req.session.destroy(() => {
    res.redirect("/account/login")
  })
}))

// Process registration (with server-side validation)
router.post(
  "/register",
  accountValidate.validateRegistration(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Deliver account update view
router.get("/update/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account information update
router.post(
  "/update",
  utilities.checkLogin,
  accountValidate.validateAccountUpdate(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  utilities.checkLogin,
  accountValidate.validatePasswordChange(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Process login (with server-side validation)
router.post(
  "/login",
  accountValidate.validateLogin(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router

