import { addMarker, addNeighborhoodMarker } from '../component/createMarker.js'
import { createProperties } from '../component/createProperties.js'
import { createFilter } from '../component/createFilter.js'
import { zoomFitMarkers } from '../lib/filterMarker.js'
import { createScrollBar } from '../component/createScrollBar.js'
import { createSearch } from '../component/createSearch.js'
import { mapBoundFilter } from '../lib/mapBoundFilter.js'

let markerPosition = []
let neighborhoodList = []
let markers = [];
let neighborhoodMarkers = [];
let markersFilter = [];

const splitMarkerZoom = 13;
const staticImgUrl = "https://cdn.jsdelivr.net/gh/rizalhasbianto/googlemapfilemaker@main/img/";
 
function initData( data, map ) {
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
        addMarker(markerData, infoWindow);
  
        // Create Property list
        createProperties(
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
        );
    }
  
    // Create Filter
    createFilter();
  
    // add Neighborhood filter based on data
    targetFilterCity?.appendChild(select);
  
    // Add Neighborhood marker
    addNeighborhoodMarker(neighborhoodList)
    
    // ZOOM Fit to markers
    zoomFitMarkers();
  
    // BUILD SCROLLBAR
    createScrollBar(target);
    
    // Search function
    createSearch();

    // FILTER FUNCTION
    const propList = document.querySelectorAll('.prop-list-wrap');
    const resetField = document.querySelectorAll(".reset-wrap")

    // Filter properties based on map
    mapBoundFilter(propList, map);

    // Reset filter
    if(resetField) {
        for (let i = 0; i < resetField.length; i++) {
        resetField[i].onclick = function () {  
            resetAll();
        }
        }
    }

    // Sort Function
    const sortSelect = document.querySelector('.map-sort');
    sortSelect?.addEventListener('change', sortData());

    // Single property link function
    const singleProLink = document.querySelectorAll('.single-property-link');
    itemLink(singleProLink);
}

export { initData }