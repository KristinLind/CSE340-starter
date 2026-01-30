const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  return res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    pageClass: "login",
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    pageClass: "register",
    errors: null, 
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  }

  req.flash("error", "Sorry, the registration failed.")
  return res.status(501).render("account/register", {
    title: "Register",
    nav,
  })
}

/* ****************************************
 *  Process login attempt
 * *************************************** */
async function accountLogin(req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("error", "Email address not found.")
    return res.status(400).render("account/login", { title: "Login", nav })
  }

  const match = await bcrypt.compare(account_password, accountData.account_password)

  if (!match) {
    req.flash("error", "Incorrect password.")
    return res.status(400).render("account/login", { title: "Login", nav })
  }

  req.flash("success", `Welcome back, ${accountData.account_firstname}!`)
  return res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin }

