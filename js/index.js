import { initData } from './lib/initData.js'
const url = 'https://BluePrintMap.hellomuto.repl.co/map-json';
let map;

// Create Map
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
})
.then(response => response.json())
.then(data => {
  // SHOWING PROPERTIES AND ADD MARKER TO MAP
  initData(data, map);
});

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
