const { body, validationResult } = require("express-validator")
const utilities = require(".")

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

module.exports = {
  validateRegistration,
  validateLogin,
  checkRegData,
  checkLoginData,
}
