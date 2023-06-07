function fillSlider(from, to, sliderColor, rangeColor, controlSlider, lowerLbl, upperLbl) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const fromPosPercent = ((fromPosition)/(rangeDistance))*100
    const toPosition = to.value - to.min;
    const toPosPercent = ((toPosition)/(rangeDistance))*100
    lowerLbl.style.left = `${fromPosPercent}%`
    upperLbl.style.left = `${toPosPercent}%`
    if(toPosPercent - fromPosPercent <= 25) {
      upperLbl.style.top = '-20px'
    } else {
      upperLbl.style.top = '-5px'
    }
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
  }
  
function controlFromSlider(lower, upper, lowerLbl, upperLbl, type) {
    const [from, to] = getParsed(lower, upper);
    const range = to - from
    if( range < 100000) {
      if(type == "lower") {
        lower.value = (to - 100000)
      } else if(type == "upper") {
        upper.value = (from + 100000)
      }
    } else {
      fillSlider(lower, upper, '#ffffff00', '#5A84C0', upper, lowerLbl, upperLbl);
    }
  }

export { controlFromSlider }