// utilities/index.js
const invModel = require("../models/inventory-model")
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

/* ************************
 * Build the classification view HTML
 ************************** */
Util.buildClassificationGrid = function (data) {
  let grid = '<ul id="inv-display">'

  data.forEach((vehicle) => {
    // normalize image path from DB:
    let imgPath = vehicle.inv_image || "/images/vehicles/no-image.png"

    // remove "public/" if someone stored it
    imgPath = imgPath.replace(/^public\//, "").replace(/^\/public\//, "/")

    // ensure leading slash
    if (!imgPath.startsWith("/")) imgPath = `/${imgPath}`

    grid += `<li>
      <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model}">
        <img src="${imgPath}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </a>
      <div class="namePrice">
        <h2>
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model}">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h2>
        <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
      </div>
    </li>`
  })

  grid += "</ul>"
  return grid
}

module.exports = Util

