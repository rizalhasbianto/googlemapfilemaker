import { addMarker, addNeighborhoodMarker } from '../component/createMarker.js'
import { createProperties } from '../component/createProperties.js'
import { createFilter } from '../component/createFilter.js'
import { zoomFitMarkers } from '../lib/filterMarker.js'
import { createScrollBar } from '../component/createScrollBar.js'
import { createSearch } from '../component/createSearch.js'
import { mapBoundFilter } from '../lib/mapBoundFilter.js'
import { itemLink, mobileViewLink } from '../lib/itemLink.js'
import { closeMobileProperty } from '../lib/closeMobileProperty.js'
import { generalEvent } from '../lib/generalEvent.js'
import { resetAll } from '../lib/resetFilter.js'

let markerPosition = []
let neighborhoodList = []
let markers = [];
let neighborhoodMarkers = [];
let markersFilter = [];

const splitMarkerZoom = 13;
const staticImgUrl = "https://blueprint-kylesmurdon.replit.app/img/";

function initData(data, map) {
  const target = document.querySelector('.properties');
  const targetFilterCity = document.querySelector('.filter-neighborhood');

  const select = document.createElement("select"),
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

    // Add Marker to map
    addMarker(markerData, infoWindow, staticImgUrl, markers, map, i);

    // Create Property list
    createProperties(
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
    );
  }

  // Create Filter
  createFilter(markers, map, splitMarkerZoom);

  // add Neighborhood filter based on data
  targetFilterCity?.appendChild(select);

  // Add Neighborhood marker
  addNeighborhoodMarker(neighborhoodList, neighborhoodMarkers, staticImgUrl, map)

  // ZOOM Fit to markers
  //zoomFitMarkers(map);

  // BUILD SCROLLBAR and LOAD IMG
  createScrollBar(target, staticImgUrl);

  // Search function
  createSearch(map);

  // FILTER FUNCTION
  const propList = document.querySelectorAll('.prop-list-wrap');
  const resetField = document.querySelectorAll(".reset-wrap")

  // Filter properties based on map
  mapBoundFilter(
    propList,
    map,
    splitMarkerZoom,
    markers,
    neighborhoodMarkers,
    staticImgUrl
  );

  // Reset filter
  if (resetField) {
    for (let i = 0; i < resetField.length; i++) {
      resetField[i].onclick = function() {
        resetAll(
          map,
          propList,
          markers,
          splitMarkerZoom
        );
      }
    }
  }

  // Sort Function
  const sortSelect = document.querySelector('.map-sort');
  sortSelect?.addEventListener('change', sortData());

  // Single property link function
  itemLink(data);

  // mobile view click
  mobileViewLink(data);

  // close mobile property popup
  closeMobileProperty(markers, staticImgUrl);

  // extra function
  generalEvent();
}

export { initData }