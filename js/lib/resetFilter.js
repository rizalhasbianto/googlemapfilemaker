  // reset function
  import { controlFromSlider } from '../lib/controlFromSlider.js'
  import { dataFilter } from '../lib/dataFilter.js'
  import { filterMarker, zoomFitMarkers } from '../lib/filterMarker.js'
  import { scrollbarChange } from '../lib/scrollProperties.js'

  function resetAll(propList) {
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
    lowerLbl.textContent = moneyFormatter.format(0);
    upperLbl.textContent = moneyFormatter.format(maxPrice);
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

export { resetAll }