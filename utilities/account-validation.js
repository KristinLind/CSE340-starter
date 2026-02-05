const { body, validationResult } = require("express-validator")
const utilities = require(".")
const accountModel = require("../models/account-model")

const validateRegistration = () => {
  return [
    body("account_firstname")
        .trim()
        .escape()   
        .notEmpty()
        .withMessage("First name is required."),

    body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Last name is required."),

    body("account_email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("A valid email address is required.")
        .normalizeEmail(),

    body("account_password")
      .trim()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
      .withMessage(
        "Password must be at least 12 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      ),
  ]
}

const validateLogin = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email address is required.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
      .withMessage(
        "Password must be at least 12 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      ),
  ]
}

const checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

const checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    })
  }
  next()
}

/* ************************************
 * Validate Account Update
 * ********************************** */
const validateAccountUpdate = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("A valid email address is required.")
      .normalizeEmail()
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id
        const account = await accountModel.getAccountByEmail(account_email)
        // Check if email exists AND belongs to a different account
        if (account && account.account_id != account_id) {
          throw new Error("Email exists. Please use a different email")
        }
      }),
  ]
}

/* ************************************
 * Check Account Update Data
 * ********************************** */
const checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      accountData,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ************************************
 * Validate Password Change
 * ********************************** */
const validatePasswordChange = () => {
  return [
    body("account_password")
      .trim()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
      .withMessage(
        "Password must be at least 12 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      ),
  ]
}

/* ************************************
 * Check Password Data
 * ********************************** */
const checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      accountData,
    })
  }
  next()
}

module.exports = {
  validateRegistration,
  validateLogin,
  checkRegData,
  checkLoginData,
  validateAccountUpdate,
  checkUpdateData,
  validatePasswordChange,
  checkPasswordData,
}
