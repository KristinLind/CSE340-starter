const baseController = {}

baseController.buildHome = async function (req, res) {
  res.render("index", {
    title: "Home",
    pageClass: "home",
  })
}

// Task 3 intentional error
baseController.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error for Assignment 3")
}

module.exports = baseController
