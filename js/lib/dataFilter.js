const priceFilter = (getPriceAttr, lowPriceSelect, highPriceSelect) => {
    if(getPriceAttr >= Number(lowPriceSelect) && getPriceAttr <= Number(highPriceSelect)) {
      return true;
    }
    return false;
  }
  
const typeFilter = (getTypeAttr, typeSelected) => {
  if(typeSelected.includes(getTypeAttr)) {
    return true;
  }
  return false;
}
  
function dataFilter(lowPriceSelected, highPriceSelected, propList, map) {
    if (propList) {
        for (let i = 0; i < propList.length; i++) {
            //const getNeighborhoodAttr = propList[i].getAttribute("neighborhood");
            //const getTypeAttr = propList[i].getAttribute("type");
            const getPriceAttr = propList[i].getAttribute("price");
            const currentLatLang = JSON.parse(propList[i].getAttribute("latlang"));
            const mapBound = map.getBounds().contains(currentLatLang);
              if (
                //neighborhoodFilter(getNeighborhoodAttr, neighborhoodSelected) && 
                //typeFilter(getTypeAttr, typeSelected) &&
                priceFilter(getPriceAttr, lowPriceSelected, highPriceSelected)
                ) {
                  if( mapBound ) {
                    propList[i].style.display = "block";
                  }
                  propList[i].setAttribute("filter","include")
              } else {
                  propList[i].style.display = "none";
                  propList[i].setAttribute("filter","exclude")
              }
        }
    }
}

export { typeFilter , dataFilter }