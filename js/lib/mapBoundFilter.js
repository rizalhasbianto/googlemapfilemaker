import { scrollbarChange } from '../lib/scrollProperties.js'
import { resetFilterToMapBound } from '../lib/resetFilter.js'
import { createBarPrice } from "../component/createFilter.js"
import { loadBigImg } from "../lib/loadBigImg.js";

function mapBoundFilter(
  propList,
  map,
  splitMarkerZoom, 
  markers,
  neighborhoodMarkers,
  staticImgUrl 
) {
  const barGraph = document.querySelector(".bar-price")
  google.maps.event.addListener(map, 'idle', function() {
    // FILTER PROPERTY BASED ON MAP BOUND
    for (let i = 0; i < propList.length; i++) {
      const currentLatLang = JSON.parse(propList[i].getAttribute("latlang"));
      const filterStatus = propList[i].getAttribute("filter");
      const mapBound = map.getBounds().contains(currentLatLang);
      if (mapBound && filterStatus == "include") {
        propList[i].style.display = "block";
        propList[i].setAttribute("filter-map","include");
        loadBigImg(propList[i], staticImgUrl);
      } else {
        propList[i].style.display = "none";
        propList[i].setAttribute("filter-map","exclude");
      }
    }
    const getMarkersOnBound = markers.filter(marker => map.getBounds().contains(marker.position));
    const maxPrice = Math.max(...getMarkersOnBound.map(item => item.price));
    scrollbarChange();
    resetFilterToMapBound(maxPrice);
    createBarPrice(barGraph, getMarkersOnBound, maxPrice);
  });

  google.maps.event.addListener(map, 'zoom_changed', function() {
    // FILTER MARKER BASED ON ZOOM
    const zoomLevel = map.getZoom();
    if (zoomLevel >= splitMarkerZoom) {
      markers.forEach((marker, i) => {
        const filterStatus = propList[i].getAttribute("filter");
        if (filterStatus == "include") {
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
}

export { mapBoundFilter }