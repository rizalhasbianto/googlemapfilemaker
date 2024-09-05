import { moneyFormatter } from '../lib/moneyFormatter.js'

export async function createProperties(
  address,
  city,
  price,
  type,
  locationData,
  bathrooms,
  bedrooms,
  img,
  status,
  id,
  select,
  neighborhood,
  neighborhoodList,
  markers,
  target,
  i,
  staticImgUrl
) {
  var wraper = document.createElement("div"),
    option = document.createElement("option");
  wraper.className = "prop-list-wrap";
  wraper.setAttribute("latLang", `{"lat": ${Number(locationData[0])}, "lng": ${Number(locationData[1])}}`);
  wraper.setAttribute("id", id);
  wraper.setAttribute("filter", "include");
  wraper.setAttribute("filter-map", "include");

  let availablePrice = ""

  if (address) {
    if (city) {
      wraper.setAttribute("neighborhood", neighborhood);
      const availableCity = neighborhoodList.find(list => list.name == neighborhood);
      if (!availableCity) {
        option.value = neighborhood;
        option.text = neighborhood;
        select.appendChild(option);
        neighborhoodList.push({
          name: neighborhood,
          total: 1
        });
      } else {
        availableCity.total = availableCity.total + 1
      }
    }
    if (price) {
      wraper.setAttribute("price", price);
      availablePrice = status !== "Under Construction" ?
        moneyFormatter.format(price) :
        "";
    }
    if (type) {
      wraper.setAttribute("type", type);
    }
    let imgListInfo = img ? 'data:image/png;base64, ' + img : staticImgUrl + 'no-image.png'
    const propertyType = type == "TH" ? "Townhouse" : "Single Family Residence"

    wraper.innerHTML = `
            <a 
              href="./single-property?recId=${id}" 
              class="single-property-link"
              data-id="${id}"
            >
              <div class="img-wrap">
                  <img src="${imgListInfo}">
              </div>
              <h2>${status}</h2>
              <div class="property-info">
                  <p class="price" style="display:none;">${availablePrice}</p>
                  <p class="property-address">${address}</p>
                  <p>${bedrooms} Bed | ${bathrooms} Bath ${propertyType}</p>
              </div>
            </a>
        `;

    wraper.onmouseover = function() {
      //markers[i].setIcon(staticImgUrl+"property-marker-black.png");
      markers[i].setAnimation(google.maps.Animation.BOUNCE)
    }
    wraper.onmouseleave = function() {
      //markers[i].setIcon(staticImgUrl+"property-marker.png");
      markers[i].setAnimation(null);
    }
    target.appendChild(wraper);
  }
}