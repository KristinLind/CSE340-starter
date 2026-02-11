const reviewModel = require("../models/review-model")
const utilities = require("../utilities")

const reviewController = {}

/* ***************************
 * Build Add Review View
 * ************************** */
reviewController.buildAddReview = async (req, res, next) => {
  try {
    const invId = parseInt(req.params.invId)
    const nav = await utilities.getNav()

    if (!res.locals.loggedin) {
      req.flash("notice", "Please log in to leave a review.")
      return res.redirect("/account/login")
    }

    res.render("reviews/add-review", {
      title: "Leave a Review",
      nav,
      invId,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Process Review Submission
 * ************************** */
reviewController.addReview = async (req, res, next) => {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const rating = parseInt(req.body.rating)
    const review_text = req.body.review_text
    const account_id = res.locals.accountData.account_id

    await reviewModel.addReview(inv_id, account_id, rating, review_text)

    req.flash("notice", "Review submitted successfully.")
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Delete Review
 * ************************** */
reviewController.deleteReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.reviewId)

    const review = await reviewModel.getReviewById(reviewId)

    if (!review) {
      req.flash("error", "Review not found.")
      return res.redirect("/")
    }

    console.log("Logged in account type:", account_type)
    
    // Allow delete only if:
    // 1. Logged in user owns review
    const account_id = res.locals.accountData.account_id
    const account_type = res.locals.accountData.account_type

    if (
      review.account_id !== account_id &&
      account_type !== "Admin"
    ) {
      req.flash("error", "Unauthorized action.")
      return res.redirect("/")
    }

    await reviewModel.deleteReview(reviewId)

    req.flash("success", "Review deleted successfully.")
    res.redirect(`/inv/detail/${review.inv_id}`)

  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Edit Review
 * ************************** */

reviewController.buildEditReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.reviewId)

    const review = await reviewModel.getReviewById(reviewId)

    if (!review) {
      req.flash("error", "Review not found.")
      return res.redirect("/")
    }

    res.render("reviews/edit-review", {
      title: "Edit Review",
      review,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Process Update Review
 * ************************** */

reviewController.updateReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.body.review_id)
    const rating = parseInt(req.body.rating)
    const review_text = req.body.review_text

    const updated = await reviewModel.updateReview(
      reviewId,
      rating,
      review_text
    )

    if (!updated) {
      req.flash("error", "Update failed.")
      return res.redirect("/")
    }

    req.flash("success", "Review updated successfully.")
    res.redirect(`/inv/detail/${updated.inv_id}`)

  } catch (err) {
    next(err)
  }
}

module.exports = reviewController

