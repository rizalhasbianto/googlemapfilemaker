function fillSlider(from, to, sliderColor, rangeColor, controlSlider, lowerLbl, upperLbl) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    lowerLbl.style.left = `${((fromPosition)/(rangeDistance))*100}%`
    upperLbl.style.left = `${((toPosition)/(rangeDistance))*100}%`
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
}
  
function controlFromSlider(lower, upper, lowerLbl, upperLbl, type) {
    const [from, to] = getParsed(lower, upper);
    const range = to - from
    if( range < 1000000) {
        if(type == "lower") {
        lower.value = (to - 1000000)
        } else if(type == "upper") {
        upper.value = (from + 1000000)
        }
    } else {
        fillSlider(lower, upper, '#ffffff00', '#5A84C0', upper, lowerLbl, upperLbl);
    }
}

export { controlFromSlider }