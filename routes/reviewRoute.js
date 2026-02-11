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

// Handle delete review
router.get(
  "/delete/:reviewId",
  utilities.handleErrors(reviewController.deleteReview)
)

// Build edit review form
router.get(
  "/edit/:reviewId",
  utilities.handleErrors(reviewController.buildEditReview)
)

// Process edit submission
router.post(
  "/edit",
  utilities.handleErrors(reviewController.updateReview)
)


module.exports = router
