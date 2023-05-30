// add single marker
function addMarker( markerData, infoWindow, staticImgUrl, markers, map ) {
    const marker = new google.maps.Marker({
      position: markerData.position,
      map,
      id: markerData.id,
      neighborhood: markerData.neighborhood,
      price: markerData.price,
      type: markerData.type,
      visible: true,
      icon: {
        url: staticImgUrl+"property-marker.png"
      },
      room: {
        bathrooms: markerData.bathrooms,
        bedrooms: markerData.bedrooms,
        sqft: markerData.sqft,
        img: markerData.img
      }
    });
  
    const imgListInfo = markerData.img ? 'data:image/png;base64, ' + markerData.img : staticImgUrl+'no-image.png'
    const contentString =
      '<div id="content" class="marker-info">' +
      `<h2 class="firstHeading">${markerData.address}, ${markerData.state} ${markerData.postalCode}</h1>` +
      '<div id="bodyContent">' +
      '<div class="detail-info">' +
      "<p> " +
      `<span>${markerData.bedrooms}, ${markerData.bathrooms}</span><br/>` +
      `<span>${markerData.address}</span><br/>` +
      `<span>${markerData.type}</span><br/>` +  
      `<span>${markerData.status}</span><br/>` +
      "</p>" +
      `<img src='${imgListInfo}' />` +
      "</div>" +
      `<p><a href="./single-property?recId=${markerData.recId}" target="_blank">` +
      "Details...</a></p>" +
      "</div>" +
      "</div>";
  
      marker.addListener("click", () => {
        if(window.innerWidth <= 600) {
          const detailElm = document.querySelector(".detail-property"),
                bathElm = detailElm.querySelector(".bathrooms"),
                bedElm = detailElm.querySelector(".bedrooms"),
                sqftElm = detailElm.querySelector(".sqfeet"),
                imgElement = detailElm.querySelector('.mbl-img-list-pop'),
                imgList = marker.room.img ? 'data:image/png;base64, ' + marker.room.img : staticImgUrl+'no-image.png';
  
                bathElm.textContent = marker.room.bathrooms;
                bedElm.textContent = marker.room.bedrooms;
                sqftElm.textContent = marker.room.sqft;
                imgElement.setAttribute("src", imgList);
                imgElement.removeAttribute("srcset")
                detailElm.classList.add("show");
                marker.setIcon(staticImgUrl+"property-marker-black-s.png");
                marker.setAnimation(google.maps.Animation.BOUNCE);
                for (let i = 0; i < markers.length; i++) {
                  if(markers[i] != marker) {
                    markers[i].setIcon(staticImgUrl+"property-marker.png");
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
  }

// find bound of area
const getAddressLatLang = address => {
  return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({address: address + "Seattle USA"}, (results, status) => {
          if (status === 'OK') {
              resolve(results[0].geometry);
          } else {
              reject(status);
          }    
      });    
  });
};

async function addNeighborhoodMarker( neighborhoodList, neighborhoodMarkers ) {
  for (let i = 0; i < neighborhoodList.length; i++) {
    const findNeighborhoodGeo = await getAddressLatLang(neighborhoodList[i].name)
    const neighborhoodMarker = new google.maps.Marker({
      position: findNeighborhoodGeo.location,
      map,
      icon: {
        url: staticImgUrl+"marker-blue.png",
        scaledSize: new google.maps.Size(30, 30)
      },
      visible: false,
      optimized: false,
      label:`${neighborhoodList[i].total}`,
    });
    neighborhoodMarkers.push(neighborhoodMarker)
  }
}

export { addMarker, addNeighborhoodMarker }