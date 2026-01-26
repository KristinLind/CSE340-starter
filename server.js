/* ***********************
 * Require Statements
 *************************/
const express = require("express")
require("dotenv").config()
const expressLayouts = require("express-ejs-layouts")
const app = express()

const staticRoute = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")
const invRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const session = require("express-session")
const pool = require("./database/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* **********************
 * Middleware 
 *************************/
app.use(express.static("public"))

app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sessionId",
}))

// Express Messages Middleware
app.use(require("connect-flash")())
app.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
    info: req.flash("info"),
  }
  next()
})
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

// Build nav for every view
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
    next()
  } catch (err) {
    next(err)
  }
})

/* ***********************
 * Routes
 *************************/
app.use(staticRoute)

app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", invRoute)

// Task 3 intentional error route
app.use(errorRoute)

app.get("/test-success", (req, res) => {
  req.flash("success", "Success banner is working!")
  res.redirect("/")
})

app.get("/test-error", (req, res) => {
  req.flash("error", "Error banner is working!")
  res.redirect("/")
})

app.get("/test-info", (req, res) => {
  req.flash("info", "Info banner is working!")
  res.redirect("/")
})

/* **********************
 * File not found route - must be last route
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ************************
 * Express Error Handler
 ***************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message = err.status == 404
    ? err.message
    : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000
app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port ${port}`)
})


