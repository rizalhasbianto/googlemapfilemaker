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

export { priceFilter, typeFilter }