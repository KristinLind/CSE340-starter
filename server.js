/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const expressLayouts = require("express-ejs-layouts")
const app = express()
const staticRoute = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")
const invRoute = require("./routes/inventoryRoute")


/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.use(express.static("public"))
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

//Index route
//app.get("/", function (req, res) {
//  res.render("index", {title: "Home"})
//})
app.get("/", baseController.buildHome)
app.use("/inv", invRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
