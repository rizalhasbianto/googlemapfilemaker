// PRICE RANGE FILTER
var lowerSlider = document.querySelector('#lower');
var upperSlider = document.querySelector('#upper');
var lowerInput = document.querySelector('#one');
var upperInput = document.querySelector('#two');
var filterLabel = document.querySelectorAll('.filter-label');
console.log(lowerSlider)
lowerInput.value=lowerSlider.value;
upperInput.value=upperSlider.value;

var lowerVal = parseInt(lowerSlider.value);
var upperVal = parseInt(upperSlider.value);

lowerSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);
    if (lowerVal > upperVal - 4) {
        upperSlider.value = lowerVal + 4;
        if (upperVal == upperSlider.max) {
            lowerSlider.value = parseInt(upperSlider.max) - 4;
        }
    }
    lowerInput.value=this.value;
}; 

upperSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    if (upperVal < lowerVal + 4) {
        lowerSlider.value = upperVal - 4;
        if (lowerVal == lowerSlider.min) {
        upperSlider.value = 4;
        }
    }
    upperInput.value=this.value;
};

lowerInput.oninput = function () {
  lowerSlider.value = this.value
}
upperInput.oninput = function () {
  upperSlider.value = this.value
}
filterLabel.forEach((label) => {
  label.onclick = function () {
    const tagetFilter = this.getAttribute("data-label");
    const filterStatus = this.getAttribute("data-status");
    if(filterStatus == "close") {
      document.querySelector(`.${tagetFilter}`).style.display = "block"
      this.setAttribute("data-status","open")
    } else {
      document.querySelector(`.${tagetFilter}`).style.display = "none"
      this.setAttribute("data-status","close")
    }
  }
})