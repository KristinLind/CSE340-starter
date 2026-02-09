// utilities/index.js
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.rows.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}"
         title="See our inventory of ${row.classification_name} vehicles">
         ${row.classification_name}
      </a>
    </li>`
  })

  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid

  if (data && data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}

Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return "<p class='notice'>Sorry, vehicle details could not be found.</p>"
  }

  return `
    <section class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>

      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

        <ul class="vehicle-specs">
          <li><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</li>
          <li><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</li>
          <li><strong>Color:</strong> ${vehicle.inv_color}</li>
          <li><strong>Classification:</strong> ${vehicle.classification_name}</li>
        </ul>

        <p class="vehicle-desc">
          <strong>Description:</strong> ${vehicle.inv_description}
        </p>
      </div>
    </section>
  `
}

Util.buildReviewSection = function (reviews) {
  let html = `<section class="review-section">
    <h2>Vehicle Reviews</h2>`

  if (!reviews || reviews.length === 0) {
    html += `<p>No reviews yet. Be the first to review this vehicle!</p>`
  } else {
    html += `<ul class="review-list">`
    reviews.forEach(review => {
      html += `
        <li class="review-item">
          <strong>${review.account_firstname} ${review.account_lastname}</strong>
          <span>Rating: ${review.rating}/5</span>
          <p>${review.review_text}</p>
          <small>${new Date(review.created_at).toLocaleDateString()}</small>
        </li>`
    })
    html += `</ul>`
  }

  html += `</section>`
  return html
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next()
  }
  req.flash("notice", "Please log in.")
  return res.redirect("/account/login")
}

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in.")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = true
      return next()
    })
  } else {
    return next()
  }
}

/* ***************************
* Middleware For Handling Errors
* Wrap other function in this for
* General Error Handling
*****************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
/* ***************************
 * Middleware to check account type for authorization
 * Only allows Employee or Admin account types
 * Redirects to login with error message if unauthorized
 *****************************/
Util.checkAccountType = (req, res, next) => {
  // Check if user is logged in and has accountData
  if (res.locals.loggedin && res.locals.accountData) {
    const accountType = res.locals.accountData.account_type
    
    // Allow Employee or Admin
    if (accountType === "Employee" || accountType === "Admin") {
      return next()
    }
  }
  
  // If not authorized, flash message and redirect to login
  req.flash("notice", "You must be an employee or administrator to access this area.")
  return res.redirect("/account/login")
}

module.exports = Util

