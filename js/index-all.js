// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
let map;
let markers = [];
let neighborhoodMarkers = [];
let markersFilter = [];
let url = 'https://BluePrintMap.hellomuto.repl.co/map-json';
let markerPosition = []
let neighborhoodList = []

const splitMarkerZoom = 13;
const staticImgUrl = "https://cdn.jsdelivr.net/gh/rizalhasbianto/googlemapfilemaker@main/img/";

function initMap() {
  if(window.innerWidth <= 600) {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: new google.maps.LatLng(47.60507343621495, -122.32353164431197),
      mapTypeId: "terrain",
      disableDefaultUI: true,
    });
  } else {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: new google.maps.LatLng(47.60507343621495, -122.32353164431197),
      mapTypeId: "terrain",
    });
  }
}

window.initMap = initMap;


fetch(url, {
  method: 'GET',
  //credentials: 'user:passwd'
})
.then(response => response.json())
.then(data => {
  // SHOWING PROPERTIES AND ADD MARKER TO MAP
  initData(data);

  //Mobile view click
  const detailElm = document.querySelector('.detail-property');
    const mobileLink = detailElm.querySelector('.view-wrap .single-property-link');
    mobileLink.addEventListener("click", function(event){ 
      const indexData = detailElm.getAttribute("index")
        event.preventDefault();
        sessionStorage.setItem(`singleProperty_${indexData}`, JSON.stringify(data[indexData]));
        window.open(`./single-property?recId=${indexData}`);
    });

  const closeDetailMapView = document.querySelector(".filter-close-prop-list");
    const detailProperty = document.querySelector(".detail-property")
    closeDetailMapView.onclick = function() {
      const indexMarker = detailProperty.getAttribute("index")
    	detailProperty.classList.remove("show");
      markers[indexMarker].setIcon(staticImgUrl+"property-marker.png");
      markers[indexMarker].setAnimation(null);
    }

  // filter function
  const propList = document.querySelectorAll('.prop-list-wrap');
  google.maps.event.addListener(map, 'idle', function() {
    // FILTER PROPERTY BASED ON MAP BOUND
    for (let i = 0; i < propList.length; i++) {
      const currentLatLang = JSON.parse(propList[i].getAttribute("latlang"));
      const filterStatus = propList[i].getAttribute("filter");
      const mapBound = map.getBounds().contains(currentLatLang);
      if(mapBound && filterStatus == "include") {
        propList[i].style.display = "block";
      } else {
        propList[i].style.display = "none";
      }
    }
    scrollbarChange();
  });

  // reset function
  const resetField = document.querySelectorAll(".reset-wrap")
  function resetAll() {
    const lower = document.querySelector("#lower"),
    upper = document.querySelector("#upper"),
    min = document.querySelector("#min"),
    max = document.querySelector("#max"),
    lowerLbl = document.querySelector("#fromprice"),
    upperLbl = document.querySelector("#toprice"),
    searchArea = document.querySelectorAll(".search-area"),
    maxPrice = upper.getAttribute("max")

    lower.value = 0;
    upper.value = maxPrice;
    lowerLbl.textContent = formatter.format(0);
    upperLbl.textContent = formatter.format(maxPrice);
    min.value = "";
    min.lastValue = "";
    max.value = "";
    max.lastValue = "";
    for (let i = 0; i < searchArea.length; i++) {
      searchArea[i].value = "";
    }

    controlFromSlider(lower, upper, lowerLbl, upperLbl);
    zoomFitMarkers();
    dataFilter(lower.value, upper.value, propList);
    filterMarker(lower.value, upper.value);
    scrollbarChange();
  }

  if(resetField) {
    for (let i = 0; i < resetField.length; i++) {
      resetField[i].onclick = function () {  
        resetAll();
      }
    }
  }

  google.maps.event.addListener(map, 'zoom_changed', function() {
    // FILTER MARKER BASED ON ZOOM
    const zoomLevel = map.getZoom();
    if( zoomLevel >= splitMarkerZoom) {
      markers.forEach((marker,i) => {
        const filterStatus = propList[i].getAttribute("filter");
        if(filterStatus == "include") {
          marker.setVisible(true)
        }
      })
      neighborhoodMarkers.forEach((marker) => {
        marker.setVisible(false)
      })
    } else {
      markers.forEach((marker) => {
        marker.setVisible(false)
      })
      neighborhoodMarkers.forEach((marker) => {
        marker.setVisible(true)
      })
    }
  });

  // Sort Function
  const sortSelect = document.querySelector('.map-sort');
  sortSelect?.addEventListener('change', function handleChange() {

    var dataProperties = document.querySelectorAll('.prop-list-wrap')
    dataProperties = Array.prototype.slice.call(dataProperties)

    if(this.value == "pricehightolow") {
      dataProperties.sort(function(a, b){
        return b.children[1].children[2].textContent - a.children[1].children[2].textContent
      });
    }
    if(this.value == "pricelowToHigh") {
      dataProperties.sort(function(a, b){
        return a.children[1].children[2].textContent - b.children[1].children[2].textContent
      });
    }
    if(this.value == "type") {
      dataProperties.sort(function(a, b){
        let before
        let after
        if(a.children[1].children[1].textContent == "SFR"){
          before = 1
        } else {
          before = 2
        }
        if(b.children[1].children[1].textContent == "SFR"){
          after = 1
        } else {
          after = 2
        }

        return before - after
      });
    }
    if(this.value == "status") {
      dataProperties.sort(function(a, b){
        let before
        let after
        if(a.children[1].children[3].textContent == "On Market"){
          before = 1
        } else if(a.children[1].children[3].textContent == "Under Construction") {
          before = 2
        } else {
          before = 3
        }
        if(b.children[1].children[3].textContent == "On Market"){
          after = 1
        } else if(b.children[1].children[3].textContent == "Under Construction") {
          after = 2
        } else {
          after = 3
        }

        return before - after
      });
    }
    
    for (let i = 0; i < dataProperties.length; i++) {
      data[i].parentNode.appendChild(data[i]);
    }
  });

  // Single property link function
  const singleProLink = document.querySelectorAll('.properties .single-property-link');
  for (let i = 0; i < singleProLink.length; i++) {
    singleProLink[i].addEventListener("click", function(event){
      event.preventDefault();
      sessionStorage.setItem(`singleProperty_${i}`, JSON.stringify(data[i]));
      window.open(`./single-property?recId=${i}`);
    });
  }
});


// SCROLLBAR change function
function scrollbarChange() {
  const target = document.querySelector('.properties');
  const propertiesWraper = document.querySelector(".info");
  const filterElement = propertiesWraper.querySelector(".filter--wrapper");
  const scrollbarInput = document.querySelector('.scrollbar')
  const scrollinnerHeight = target.scrollHeight;
  const propertiesWraperHeight = propertiesWraper.clientHeight;
  const filterheight = filterElement.clientHeight;
  const totalscroll = (scrollinnerHeight-propertiesWraperHeight)+filterheight;
  scrollbarInput.setAttribute("max",totalscroll)
}

// SHOWING PROPERTIES AND ADD MARKER TO MAP
function initData(data) {
  const target = document.querySelector('.properties');
  const targetFilterCity = document.querySelector('.filter-neighborhood');

  var select = document.createElement("select"),
      firstOption = document.createElement("option");
  select.name = "neighborhood";
  select.id = "neighborhood";
  select.className = "map-filter"
  firstOption.text = "All neighborhood";
  select.appendChild(firstOption);
  let infoWindow = new google.maps.InfoWindow();

  for (let i = 0; i < data.length; i++) {
      const id = data[i]?.id;
      const recId = i;
      const address = data[i]?.address1;
      const city = data[i]?.city;
      const state = data[i]?.state;
      const postalCode = data[i]?.postalCode;
      const neighborhood = data[i]?.neighborhood;
      const bathrooms = data[i]?.bathrooms;
      const bedrooms = data[i]?.bedrooms;
      const sqft = data[i]?.sqfeet;
      const type = data[i]?.type;
      const status = data[i]?.status;
      const price = Number(data[i]?.webprice);
      const img = data[i]?.thumbnailimagebase64;
      const locationData = data[i]?.geolocation.split(",");

      const markerData = {
        position: { lat: Number(locationData[0]), lng: Number(locationData[1]) }, 
        neighborhood,
        address,
        state,
        postalCode,
        bathrooms: bathrooms,
        bedrooms: bedrooms,
        sqft: sqft,
        type,
        status,
        price,
        img,
        recId,
        id
      };

      addMarker(markerData, infoWindow, i);

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
        const formatter = new Intl.NumberFormat('en-US', {
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
              <p class="price">${formatter.format(markerData.price)}</p>
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

  // Get price range
  var lower = document.createElement("input"),
      upper = document.createElement("input"),
      min = document.createElement("input"),
      max = document.createElement("input"),
      lowerLbl = document.createElement("span"),
      upperLbl = document.createElement("span"),
      slideTrackwrap = document.createElement("div")
      lowerLbl.setAttribute("id","fromprice")
      upperLbl.setAttribute("id","toprice")
      slideTrackwrap.setAttribute("class","slide-track")

  const propList = document.querySelectorAll('.prop-list-wrap');
  const priceRange = document.querySelector('.price-field');
  const priceinput = document.querySelector('.price-wrap');
  const minPrice = Math.min(...markers.map(item => item.price));
  const maxPrice = Math.max(...markers.map(item => item.price));

  lowerLbl.textContent = formatter.format(minPrice)
  upperLbl.textContent = formatter.format(maxPrice)

  Object.assign(lower, {
    id: 'lower',
    type: 'range',
    min: minPrice,
    max: maxPrice,
    value: minPrice,
    onchange: function () {
      dataFilter(this.value, upper.value, propList);
      filterMarker(this.value, upper.value);
      scrollbarChange();
    },
    oninput: function() {
      controlFromSlider(this, upper, lowerLbl, upperLbl, "lower")
      lowerLbl.textContent = formatter.format(this.value)
    }
  })
  Object.assign(upper, {
    id: 'upper',
    type: 'range',
    min: minPrice,
    max: maxPrice,
    value: maxPrice,
    onchange: function () {
      dataFilter(lower.value, this.value, propList);
      filterMarker(lower.value, this.value);
      scrollbarChange();
    },
    oninput: function() {
      controlFromSlider(lower, this, lowerLbl, upperLbl, "upper")
      upperLbl.textContent = formatter.format(this.value)
    }
  })
  Object.assign(min, {
    id: 'min',
    className: 'input-filter',
    inputMode:'decimal',
    placeholder: 'minimum',
    min: minPrice,
    max: maxPrice,
    onfocus: function() {
      this.type='number';
      this.value=this.lastValue;
    },
    onblur: function() {
      this.type=''; 
      this.lastValue=this.value; 
      this.value= this.value==''?'': formatter.format(this.value)
    },
    onchange: function () {
      let maxVal = parseInt(upper.value) - 100000;
      if(this.value > maxVal) {
        this.value = maxVal
      } else {
        maxVal = parseInt(this.value)
      }
      lower.value = maxVal
      controlFromSlider(lower, upper, lowerLbl, upperLbl)
      lowerLbl.textContent = formatter.format(maxVal)
      dataFilter(maxVal, upper.value, propList);
      filterMarker(maxVal, upper.value);
    }
  })
  Object.assign(max, {
    id: 'max',
    inputMode:'decimal',
    placeholder: 'maximum',
    min: minPrice,
    max: maxPrice,
    onfocus: function() {
      this.type='number';
      this.value=this.lastValue;
    },
    onblur: function() {
      this.type=''; 
      this.lastValue=this.value; 
      this.value= this.value==''?'': formatter.format(this.value)
    },
    onchange: function () {
      let minVal = parseInt(lower.value) + 100000;
      
      if(this.value < minVal) {
        this.value = minVal
      } else {
        minVal = parseInt(this.value)
      }
      upper.value = minVal
      controlFromSlider(lower, upper, lowerLbl, upperLbl)
      upperLbl.textContent = formatter.format(minVal)
      dataFilter(lower.value, minVal, propList);
      filterMarker(lower.value, minVal);
    },
  })

  priceRange.append(lower, upper, lowerLbl, upperLbl, slideTrackwrap)
  priceinput.appendChild(min)
  priceinput.appendChild(max)

  // Mobile price filter
  const minimumPriceElement = document.querySelectorAll(".price-filter-list");
  let minimumPriceMobile = 0,
      maximumPriceMobile = maxPrice

  for (let h = 0; h < minimumPriceElement.length; h++) {
    for (let i = 0; i < 30; i++) {
      let price
      const priceNumber = ( i + 1 ) * 100;
      if(priceNumber < 1000) {
        price = `$${priceNumber} K`;
      } else {
        price = `$${priceNumber / 1000} M`;
      }

      var optList = document.createElement("li");
      optList.className = "list-price-item";
      optList.textContent = price;
      minimumPriceElement[h].appendChild(optList);
    }
    minimumPriceElement[h].onscroll = function(){
      const scrollPos = this.scrollTop / 30
      const validation = (scrollPos - Math.floor(scrollPos)) !== 0
      if(!validation) {
        if(h == 0) {
          minimumPriceMobile = scrollPos * 100000
        } else {
          const priceVal = scrollPos == 0 ? maxPrice : scrollPos * 100000 ;
          maximumPriceMobile = priceVal
        }
        dataFilter(minimumPriceMobile, maximumPriceMobile, propList);
        filterMarker(minimumPriceMobile, maximumPriceMobile);
      }
    }
  }

  // add Neighborhood filter based on data
  targetFilterCity?.appendChild(select);

  // Add Neighborhood marker
  addNeighborhoodMarker(neighborhoodList)
  
  // ZOOM Fit to markers
  zoomFitMarkers();

  // BUILD SCROLLBAR
  const scrollbarWraper = document.querySelector(".scroll-fake");
  const propertiesWraper = document.querySelector(".info");
  const filterElement = propertiesWraper.querySelector(".filter--wrapper");
  var scrollbar = document.createElement("input");
  const scrollinnerHeight = target.scrollHeight;
  const propertiesWraperHeight = propertiesWraper.clientHeight;
  const filterheight = filterElement.clientHeight;
  const totalscroll = (scrollinnerHeight-propertiesWraperHeight)+filterheight;
  Object.assign(scrollbar, {
    id: 'scrollbar-miror',
    className: "scrollbar",
    type: 'range',
    min: 0,
    max:totalscroll,
    style:`width:${propertiesWraperHeight-filterheight}px;`,
    oninput: function () {
      propertiesWraper.scrollTop = this.value
    },
  })
  scrollbarWraper.appendChild(scrollbar)
  propertiesWraper.addEventListener("scroll", function() {
    scrollbar.value = this.scrollTop;
  });
  
  // Search function
  const searchField = document.querySelectorAll('.search-field');
  var searchInput = document.createElement("input");
  Object.assign(searchInput, {
    className: "search-area",
    type: 'text',
    style:`width:${propertiesWraperHeight-filterheight}px;`,
    oninput: function () {
      searchAddress(this.value)
    },
  });
  for (let i = 0; i < searchField.length; i++) {
    searchField[i].appendChild(searchInput)
  }
}

// price slide fill with bg
function fillSlider(from, to, sliderColor, rangeColor, controlSlider, lowerLbl, upperLbl) {
  const rangeDistance = to.max-to.min;
  const fromPosition = from.value - to.min;
  const fromPosPercent = ((fromPosition)/(rangeDistance))*100
  const toPosition = to.value - to.min;
  const toPosPercent = ((toPosition)/(rangeDistance))*100
  lowerLbl.style.left = `${fromPosPercent}%`
  upperLbl.style.left = `${toPosPercent}%`
  if(toPosPercent - fromPosPercent <= 25) {
    upperLbl.style.top = '-20px'
  } else {
    upperLbl.style.top = '-5px'
  }
  controlSlider.style.background = `linear-gradient(
    to right,
    ${sliderColor} 0%,
    ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
    ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
    ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
    ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
    ${sliderColor} 100%)`;
}

function controlFromSlider(lower, upper, lowerLbl, upperLbl, type) {
  const [from, to] = getParsed(lower, upper);
  const range = to - from
  if( range < 100000) {
    if(type == "lower") {
      lower.value = (to - 100000)
    } else if(type == "upper") {
      upper.value = (from + 100000)
    }
  } else {
    fillSlider(lower, upper, '#ffffff00', '#5A84C0', upper, lowerLbl, upperLbl);
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

// format text to money
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

// zoom fit marker function
function zoomFitMarkers() {
  //let latlngbounds = new google.maps.LatLngBounds();
  //for (let i = 0; i < markers.length; i++) {
  //  latlngbounds.extend(markers[i].position);
  //}
  //map.fitBounds(latlngbounds);
  //var zoom = map.getZoom();
  map.setZoom(13);
}

const neighborhoodFilter = (getNeighborhoodAttr, neighborhoodSelected) => {
  if(neighborhoodSelected == "All neighborhood") {
    return true;
  } 
  if (getNeighborhoodAttr == neighborhoodSelected) {
    return true;
  } 
  return false;
}

const priceFilter = (getPriceAttr, lowPriceSelect, highPriceSelect) => {
  if(getPriceAttr >= Number(lowPriceSelect) && getPriceAttr <= Number(highPriceSelect)) {
    return true;
  }
  return false;
}

const typeFilter = (getTypeAttr, typeSelected) => {
  if(typeSelected.includes(getTypeAttr)) {
    return true;
  }
  return false;
}

function dataFilter(lowPriceSelected, highPriceSelected, propList) {
    if (propList) {
        for (let i = 0; i < propList.length; i++) {
            //const getNeighborhoodAttr = propList[i].getAttribute("neighborhood");
            //const getTypeAttr = propList[i].getAttribute("type");
            const getPriceAttr = propList[i].getAttribute("price");
            const currentLatLang = JSON.parse(propList[i].getAttribute("latlang"));
            const mapBound = map.getBounds().contains(currentLatLang);
              if (
                //neighborhoodFilter(getNeighborhoodAttr, neighborhoodSelected) && 
                //typeFilter(getTypeAttr, typeSelected) &&
                priceFilter(getPriceAttr, lowPriceSelected, highPriceSelected)
                ) {
                  if( mapBound ) {
                    propList[i].style.display = "block";
                  }
                  propList[i].setAttribute("filter","include")
              } else {
                  propList[i].style.display = "none";
                  propList[i].setAttribute("filter","exclude")
              }
        }
    }
}

// MAP FUNCTION
// add neighborhood marker

async function addNeighborhoodMarker( neighborhoodList ) {
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

// find address based on input
async function searchAddress( address ) {
  const findAddressGeo = await getAddressLatLang(address)
  map.fitBounds(findAddressGeo.bounds);
  var zoom = map.getZoom();
  map.setZoom(zoom < 13 ? 13 : zoom);
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

// add single marker
function addMarker( markerData, infoWindow, i ) {
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

              detailElm.setAttribute("index", i)
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

// Filter markers at map
function filterMarker(lowPriceSelected, highPriceSelected) {
  //let latlngbounds = new google.maps.LatLngBounds();
  for (let i = 0; i < markers.length; i++) {
    //const getNeighborhoodAttr = markers[i].neighborhood;
    //const getTypeAttr = markers[i].type;
    const getPriceAttr = markers[i].price;
    const zoomLevel = map.getZoom();
    if (
      //neighborhoodFilter(getNeighborhoodAttr, neighborhoodSelected) && 
      //typeFilter(getTypeAttr, typeSelected) &&
      priceFilter(getPriceAttr, lowPriceSelected, highPriceSelected)
      ) {
        if(zoomLevel >= splitMarkerZoom)
        markers[i].setVisible(true);
      //latlngbounds.extend(markers[i].position);
    } else {
      markers[i].setVisible(false);
    }
  }
  //map.fitBounds(latlngbounds);
  //var zoom = map.getZoom();
  //map.setZoom(zoom > 12 ? 12 : zoom);
}

function check_is_in_or_out(marker){
  return map.getBounds().contains(marker.getPosition());
}

// Load big img to properties

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)

  );
}


