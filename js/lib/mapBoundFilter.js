import { scrollbarChange } from '../lib/scrollbarChange.js'

function mapBoundFilter (propList, map) {
    google.maps.event.addListener(map, 'idle', function () {
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
}

export { mapBoundFilter }