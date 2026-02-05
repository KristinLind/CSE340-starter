const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    pageClass: "account-management",
  })
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdateAccount(req, res) {
  const nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  if (res.locals.accountData.account_id !== account_id) {
    req.flash("notice", "Access denied.")
    return res.redirect("/account/")
  }
  
  const accountData = await accountModel.getAccountById(account_id)
  
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
  })
}

/* ****************************************
 *  Process account update
 * *************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )
  
  if (updateResult) {
    // Get updated account data
    const accountData = await accountModel.getAccountById(account_id)
    
    // Update JWT token with new information
    delete accountData.account_password
    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    )
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000,
    }
    if (process.env.NODE_ENV !== "development") {
      cookieOptions.secure = true
    }
    res.cookie("jwt", accessToken, cookieOptions)
    
    req.flash("success", "Account information updated successfully.")
    return res.redirect("/account/")
  } else {
    req.flash("error", "Sorry, the update failed.")
    const accountData = await accountModel.getAccountById(account_id)
    return res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData,
    })
  }
}

/* ****************************************
 *  Process password change
 * *************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  
  // Hash the new password
  const hashedPassword = await bcrypt.hash(account_password, 10)
  
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)
  
  if (updateResult) {
    req.flash("success", "Password changed successfully.")
    return res.redirect("/account/")
  } else {
    req.flash("error", "Sorry, the password change failed.")
    const accountData = await accountModel.getAccountById(account_id)
    return res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData,
    })
  }
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
    req.flash("success", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  req.flash("error", "Sorry, the registration failed.")
  return res.status(501).render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (passwordMatch) {
      delete accountData.account_password

      // expiresIn MUST be seconds (3600), not milliseconds
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      )

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
      }

      // secure cookies only in production/https
      if (process.env.NODE_ENV !== "development") {
        cookieOptions.secure = true
      }

      res.cookie("jwt", accessToken, cookieOptions)
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
} catch (error) {
  console.log("LOGIN ERROR:", error.message)
  throw error
}
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
}

