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

module.exports = reviewController

