function createSearch(map) {
  const searchField = document.querySelectorAll('.search-field');
  const propertiesWraper = document.querySelector(".info");
  const filterElement = propertiesWraper.querySelector(".filter--wrapper");
  const propertiesWraperHeight = propertiesWraper.clientHeight;
  const filterheight = filterElement.clientHeight;
  var searchInput = document.createElement("input");
  Object.assign(searchInput, {
    className: "search-area",
    type: 'text',
    style: `width:${propertiesWraperHeight - filterheight}px;`,
    oninput: function() {
      searchAddress(this.value, map)
    },
  });
  for (let i = 0; i < searchField.length; i++) {
    searchField[i].appendChild(searchInput)
  }
}

async function searchAddress(address, map) {
  const findAddressGeo = await getAddressLatLang(address)
  if (findAddressGeo.bounds) {
    map.fitBounds(findAddressGeo.bounds);
    var zoom = map.getZoom();
    map.setZoom(zoom < 13 ? 13 : zoom);
  } else {
    console.log("address not found")
  }
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

export { createSearch }