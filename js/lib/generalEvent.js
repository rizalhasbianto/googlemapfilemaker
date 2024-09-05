export function generalEvent() {
    const priceButton = document.querySelector(".mobile-price-filter-wrap");
    const mobilePriceFilter = document.querySelector(".mobile-price-filter");
    const closePriceButton = document.querySelector(".filter-close");
    const desktopFilterPriceButton = document.querySelector(".filter-toggle");
    const filterPriceElm = document.querySelector(".filter-price");
    document.onclick = function(e) {
      if(!e.target.classList.contains("doc-click")){
        priceButton.classList.remove("show")
        mobilePriceFilter.classList.remove("show")
        closePriceButton.classList.remove("show")
      } 
      const terms = [
        "filter-price-wrap", 
        "text-block-75", 
        "triangle", 
        "filter-price",
        "price-field",
        "slide-track",
        "price-wrap",
        "input-filter",
      ]
      const result = terms.some(term => e.target.classList.contains(term)) 
      if(!result) {
      	filterPriceElm.classList.remove("show");
        desktopFilterPriceButton.classList.remove("show");
      }
    }
    priceButton.onclick = function() {
      if(priceButton.classList.contains("show")) {
      	priceButton.classList.remove("show")
        mobilePriceFilter.classList.remove("show")
        closePriceButton.classList.remove("show")
      } else {
      	priceButton.classList.add("show")
        mobilePriceFilter.classList.add("show")
        closePriceButton.classList.add("show")
      }
    }
    closePriceButton.onclick = function() {
      priceButton.classList.remove("show")
      mobilePriceFilter.classList.remove("show")
      closePriceButton.classList.remove("show")
    }
    desktopFilterPriceButton.onclick = function() {
      if(this.classList.contains("show")) {
        this.classList.remove("show")
        filterPriceElm.classList.remove("show")
      } else {
        this.classList.add("show")
        filterPriceElm.classList.add("show")
      }
    }
    
    // toogle map and list
    const buttonView =  document.querySelector(".toogle-list");
    
    buttonView.onclick = function() {
        const currentText = this.textContent;
        const mapElmWrap =  document.querySelector(".map-wraper");
        const porplist = document.querySelector(".info");
        if ( currentText == "List" ) {
            this.textContent = "Map"
            mapElmWrap.classList.add("list-view")
            porplist.scroll({
            top: 0,
            behavior: 'smooth'
            })
        } else {
            this.textContent = "List"
            mapElmWrap.classList.remove("list-view")
        }
    }
}