import { priceFilter, typeFilter } from '../lib/filterFunction.js'

// Filter markers at map
function filterMarker(lowPriceSelected, highPriceSelected, map, markers, splitMarkerZoom) {
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
      if (zoomLevel >= splitMarkerZoom)
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

// zoom fit marker function
function zoomFitMarkers(map, latlngbounds) {
  // fit zoom to available markers
  //let latlngbounds = new google.maps.LatLngBounds();
  //for (let i = 0; i < markers.length; i++) {
  //  latlngbounds.extend(markers[i].position);
  //}

  // fit zoom to selected latlngbounds
  map.fitBounds(latlngbounds);
  var zoom = map.getZoom();
  map.setZoom(zoom < 13 ? 13 : zoom);
}

function panToLocation(map, latlng) {
  // fit zoom to selected latlngbounds
  map.setZoom(14);
  map.panTo(latlng)
}

export { filterMarker, zoomFitMarkers, panToLocation }