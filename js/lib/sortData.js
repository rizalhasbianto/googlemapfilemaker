function sortData() {

    var dataProperties = document.querySelectorAll('.prop-list-wrap')
    dataProperties = Array.prototype.slice.call(dataProperties)

    if(this.value == "pricehightolow") {
      dataProperties.sort(function(a, b){
        return b.children[1].children[2].textContent - a.children[1].children[2].textContent
      });
    }
    if(this.value == "pricelowToHigh") {
      dataProperties.sort(function(a, b){
        return a.children[1].children[2].textContent - b.children[1].children[2].textContent
      });
    }
    if(this.value == "type") {
      dataProperties.sort(function(a, b){
        let before
        let after
        if(a.children[1].children[1].textContent == "SFR"){
          before = 1
        } else {
          before = 2
        }
        if(b.children[1].children[1].textContent == "SFR"){
          after = 1
        } else {
          after = 2
        }

        return before - after
      });
    }
    if(this.value == "status") {
      dataProperties.sort(function(a, b){
        let before
        let after
        if(a.children[1].children[3].textContent == "On Market"){
          before = 1
        } else if(a.children[1].children[3].textContent == "Under Construction") {
          before = 2
        } else {
          before = 3
        }
        if(b.children[1].children[3].textContent == "On Market"){
          after = 1
        } else if(b.children[1].children[3].textContent == "Under Construction") {
          after = 2
        } else {
          after = 3
        }

        return before - after
      });
    }
    
    for (let i = 0; i < dataProperties.length; i++) {
      data[i].parentNode.appendChild(data[i]);
    }
  }

export { sortData }