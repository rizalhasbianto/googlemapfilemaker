import { controlFromSlider } from '../lib/controlFromSlider.js'
import { dataFilter } from '../lib/dataFilter.js'
import { filterMarker } from '../lib/filterMarker.js'
import { scrollbarChange } from '../lib/scrollProperties.js'
import { moneyFormatter } from '../lib/moneyFormatter.js'

function createFilter(markers, map, splitMarkerZoom) {
    var lower = document.createElement("input"),
        upper = document.createElement("input"),
        min = document.createElement("input"),
        max = document.createElement("input"),
        lowerLbl = document.createElement("span"),
        upperLbl = document.createElement("span"),
        slideTrackwrap = document.createElement("div")
    lowerLbl.setAttribute("id", "fromprice")
    upperLbl.setAttribute("id", "toprice")
    slideTrackwrap.setAttribute("class", "slide-track")

    const propList = document.querySelectorAll('.prop-list-wrap');
    const priceRange = document.querySelector('.price-field');
    const priceinput = document.querySelector('.price-wrap');
    const minPrice = Math.min(...markers.map(item => item.price));
    const maxPrice = Math.max(...markers.map(item => item.price));

    lowerLbl.textContent = moneyFormatter.format(minPrice)
    upperLbl.textContent = moneyFormatter.format(maxPrice)

    Object.assign(lower, {
        id: 'lower',
        className: 'input-filter',
        type: 'range',
        min: minPrice,
        max: maxPrice,
        value: minPrice,
        onchange: function() {
            dataFilter(this.value, upper.value, propList, map);
            filterMarker(this.value, upper.value, map, markers, splitMarkerZoom);
            scrollbarChange();
        },
        oninput: function() {
            controlFromSlider(this, upper, lowerLbl, upperLbl, "lower")
            lowerLbl.textContent = moneyFormatter.format(this.value)
        }
    })

    Object.assign(upper, {
        id: 'upper',
        className: 'input-filter',
        type: 'range',
        min: minPrice,
        max: maxPrice,
        value: maxPrice,
        onchange: function() {
            dataFilter(lower.value, this.value, propList, map);
            filterMarker(lower.value, this.value, map, markers, splitMarkerZoom);
            scrollbarChange();
        },
        oninput: function() {
            controlFromSlider(lower, this, lowerLbl, upperLbl, "upper")
            upperLbl.textContent = moneyFormatter.format(this.value)
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
          this.value= this.value==''?'': moneyFormatter.format(this.value)
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
          lowerLbl.textContent = moneyFormatter.format(maxVal)
          dataFilter(maxVal, upper.value, propList, map);
          filterMarker(maxVal, upper.value, map, markers, splitMarkerZoom);
        }
    })

    Object.assign(max, {
        id: 'max',
        className: 'input-filter',
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
          this.value= this.value==''?'': moneyFormatter.format(this.value)
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
          upperLbl.textContent = moneyFormatter.format(minVal)
          dataFilter(lower.value, minVal, propList, map);
          filterMarker(lower.value, minVal, map, markers, splitMarkerZoom);
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
            const priceNumber = (i + 1) * 100;
            if (priceNumber < 1000) {
                price = `$${priceNumber} K`;
            } else {
                price = `$${priceNumber / 1000} M`;
            }

            var optList = document.createElement("li");
            optList.className = "list-price-item";
            optList.textContent = price;
            minimumPriceElement[h].appendChild(optList);
        }
        minimumPriceElement[h].onscroll = function() {
            const scrollPos = this.scrollTop / 30
            const validation = (scrollPos - Math.floor(scrollPos)) !== 0
            if (!validation) {
                if (h == 0) {
                    minimumPriceMobile = scrollPos * 100000
                } else {
                    const priceVal = scrollPos == 0 ? maxPrice : scrollPos * 100000;
                    maximumPriceMobile = priceVal
                }
                dataFilter(minimumPriceMobile, maximumPriceMobile, propList, map);
                filterMarker(minimumPriceMobile, maximumPriceMobile, map, markers, splitMarkerZoom);
            }
        }
    }
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

  export{ createFilter, neighborhoodFilter }