import { getBigImgdata } from "../lib/getBigImgData.js"
import { panToLocation } from "../lib/filterMarker.js"

// add single marker
function addMarker(markerData, infoWindow, staticImgUrl, markers, map, i) {
  const marker = new google.maps.Marker({
    position: markerData.position,
    map,
    id: markerData.id,
    neighborhood: markerData.neighborhood,
    price: markerData.price,
    type: markerData.type,
    visible: true,
    icon: {
      url: staticImgUrl + "property-marker.png"
    },
    room: {
      bathrooms: markerData.bathrooms,
      bedrooms: markerData.bedrooms,
      sqft: markerData.sqft,
      img: markerData.img
    }
  });

  const imgListInfo = markerData.img ? 'data:image/png;base64, ' + markerData.img : staticImgUrl + 'no-image.png'
  const checkVal = (data) => {
    if (data && data != "undefined") {
      return data
    } else {
      return '';
    }
  }
  const contentString =
    '<div id="content" class="marker-info">' +
    `<h2 class="firstHeading">${checkVal(markerData.address)}, ${checkVal(markerData.state)} ${checkVal(markerData.postalCode)}</h1>` +
    '<div id="bodyContent">' +
    '<div class="detail-info">' +
    '<div class="detail-info-wrap">' +
    "<p> " +
    `<span class="bedbath">${checkVal(markerData.bathrooms)} Bed, ${checkVal(markerData.bedrooms)} Bath</span><br/>` +
    `<span>${checkVal(markerData.address)}</span><br/>` +
    `<span>${checkVal(markerData.type)}</span><br/>` +
    `<br/>` +
    "</p>" +
    `<p class="url-marker"><a href="./single-property?recId=${checkVal(markerData.id)}" target="_blank">` +
    `View Details</a><span>${checkVal(markerData.status)}</span></p>` +
    "</div>" +
    `<img src='${checkVal(imgListInfo)}' />` +
    "</div>" +
    "</div>" +
    "</div>";

  marker.addListener("click", async () => {
    if (window.innerWidth <= 600) {
      const detailElm = document.querySelector(".detail-property"),
        bathElm = detailElm.querySelector(".bathrooms"),
        bedElm = detailElm.querySelector(".bedrooms"),
        sqftElm = detailElm.querySelector(".sqfeet"),
        imgElement = detailElm.querySelector('.mbl-img-list-pop'),
        imgList = marker.room.img ? 'data:image/png;base64, ' + marker.room.img : staticImgUrl + 'no-image.png';

      const imgData = await getBigImgdata(marker.id, staticImgUrl)

      detailElm.setAttribute("data-id", marker.id);
      detailElm.setAttribute("index", i)
      bathElm.textContent = marker.room.bathrooms;
      bedElm.textContent = marker.room.bedrooms;
      sqftElm.textContent = marker.room.sqft;
      imgElement.setAttribute("src", imgData);
      imgElement.removeAttribute("srcset")
      detailElm.classList.add("show");
      marker.setIcon(staticImgUrl + "property-marker-black-s.png");
      marker.setAnimation(google.maps.Animation.BOUNCE);
      for (let i = 0; i < markers.length; i++) {
        if (markers[i] != marker) {
          markers[i].setIcon(staticImgUrl + "property-marker.png");
          markers[i].setAnimation(null);
        }
      }
    } else {
      infoWindow.setContent(contentString)
      infoWindow.open({
        anchor: marker,
        map,
      });
    }
  });

  markers.push(marker);

  google.maps.event.addListener(map, "click", function(event) {
    infoWindow.close();
  });
}

// find bound of area
const getAddressLatLang = address => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address + "Seattle USA" }, (results, status) => {
      if (status === 'OK') {
        resolve(results[0].geometry);
      } else {
        reject(status);
      }
    });
  });
};

async function addNeighborhoodMarker(neighborhoodList, neighborhoodMarkers, staticImgUrl, map) {
  for (let i = 0; i < neighborhoodList.length; i++) {
    const findNeighborhoodGeo = await getAddressLatLang(neighborhoodList[i].name)
    const neighborhoodMarker = new google.maps.Marker({
      position: findNeighborhoodGeo.location,
      map,
      icon: {
        url: staticImgUrl + "marker-blue.png",
        scaledSize: new google.maps.Size(30, 30)
      },
      visible: false,
      optimized: false,
      label: `${neighborhoodList[i].total}`,
    });
    neighborhoodMarkers.push(neighborhoodMarker)

    neighborhoodMarker.addListener("click", async () => {
      console.log("nigborhood geo = ", findNeighborhoodGeo)
      panToLocation(map, findNeighborhoodGeo.location)
    });
  }
}

export { addMarker, addNeighborhoodMarker }