import { initData } from './lib/initData.js'
import { initMap } from './lib/initMap.js'
const url = 'https://BluePrintMap.hellomuto.repl.co/map-json';

// Create Map
window.initMap = initMap;

fetch(url, {
  method: 'GET',
})
.then(response => response.json())
.then(data => {
  // SHOWING PROPERTIES AND ADD MARKER TO MAP
  initData(data);
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
