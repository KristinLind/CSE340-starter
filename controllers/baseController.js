// controllers/baseController.js
const utilities = require("../utilities/")

const baseController = {}

baseController.buildHome = async function (req, res) {
  res.render("index", {
    title: "Home",
    pageClass: "home",
  })
}

module.exports = baseController
