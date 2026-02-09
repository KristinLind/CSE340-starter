const reviewModel = require("../models/review-model")
const utilities = require("../utilities")

/* ***************************
 * Process new review
 * ************************** */
async function addReview(req, res) {
  const { inv_id, rating, review_text } = req.body
  const account_id = res.locals.accountData.account_id

  await reviewModel.addReview(
    inv_id,
    account_id,
    rating,
    review_text
  )

  req.flash("success", "Review submitted successfully.")
  res.redirect(`/inv/detail/${inv_id}`)
}

module.exports = {
  addReview,
}
