function createProperties(
    address, 
    city, 
    price, 
    type, 
    locationData, 
    id, 
    select, 
    neighborhood, 
    neighborhoodList, 
    markerData, 
    markers, 
    target,
    i
    ) {
    var wraper = document.createElement("div"),
          option = document.createElement("option");
      wraper.className = "prop-list-wrap";
      wraper.setAttribute("latLang",`{"lat": ${Number(locationData[0])}, "lng": ${Number(locationData[1])}}`);
      wraper.setAttribute("id",id);
      wraper.setAttribute("filter", "include");
      wraper.setAttribute("filter-map", "include");

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
        }
        if (type) {
            wraper.setAttribute("type", type);
        }

        const imgListInfo = markerData.img ? 'data:image/png;base64, ' + markerData.img : staticImgUrl+'no-image.png'
        const propertyType = markerData.type == "TH" ? "Townhouse" : "Single Family Residence"
        const moneyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });

        wraper.innerHTML = `
            <a href="./single-property?recId=${markerData.recId}" class="single-property-link">
            <div class="img-wrap">
                <img src="${imgListInfo}">
            </div>
            <h2>${markerData.status}</h2>
            <div class="property-info">
                <p class="price">${moneyFormatter.format(markerData.price)}</p>
                <p class="property-address">${markerData.address}</p>
                <p>${markerData.bedrooms} Bed | ${markerData.bathrooms} Bath ${propertyType}</p>
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

export { createProperties }