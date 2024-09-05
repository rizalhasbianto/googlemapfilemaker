import { initData } from './lib/initData.js'
import { loadFirstBigImg } from './lib/loadBigImg.js';

const url = 'https://blueprint-kylesmurdon.replit.app/map-json';
let map;
let loaded = false

// Create Map
function initMap() {
  if (window.innerWidth <= 600) {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: new google.maps.LatLng(47.60507343621495, -122.32353164431197),
      mapTypeId: "terrain",
      disableDefaultUI: true,
      gestureHandling: "greedy",
    });
  } else {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: new google.maps.LatLng(47.60507343621495, -122.32353164431197),
      mapTypeId: "terrain",
    });
  }

  map.addListener('tilesloaded', function() {
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        // CREATE PROPERTIES AND ADD MARKER TO MAP
        if (map && !loaded) {
          initData(data, map);
          loadFirstBigImg();
          loaded = true
        }
      });
  })
}

window.initMap = initMap;