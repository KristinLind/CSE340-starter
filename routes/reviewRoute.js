const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const reviewController = require("../controllers/reviewController")

// Display add review form
router.get(
  "/add/:invId",
  utilities.handleErrors(reviewController.buildAddReview)
)

// Handle review submission
router.post(
  "/add",
  utilities.handleErrors(reviewController.addReview)
)

module.exports = router
