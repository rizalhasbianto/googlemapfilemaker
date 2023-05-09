  // Getting Property Detail

  document.addEventListener('DOMContentLoaded', function(event) {
    const staticImgUrl = "https://cdn.jsdelivr.net/gh/rizalhasbianto/googlemapfilemaker@main/img/";
    const url = 'https://BluePrintMap.hellomuto.repl.co/map-json';
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const recId = urlParams.get('recId');
    const getPropertyData = sessionStorage.getItem(`singleProperty_${recId}`);

    if(getPropertyData) {
      const propertyData = JSON.parse(getPropertyData);
      // load data into html
      initData(propertyData);
    } else {
      fetch(url, {
        method: 'GET',
        //credentials: 'user:passwd'
      })
      .then(response => response.json())
      .then(data => {
        const propertyData = data[recId]
        // load data into html
        initData(propertyData);
      })
    }
  })

//Print data to html
function initData(data) {

  // hide or show loan data
  if(data.listingagentcompany) {
    const listingElement = document.querySelector('.listing');
    listingElement.style.display = "block"
  }
  if(data.gccompany) {
    const listingElement = document.querySelector('.contractor-w');
    listingElement.style.display = "block"
  }

  // load img to html
  const imgList = data.imagebase64 ? 'data:image/png;base64, ' + data.imagebase64 : staticImgUrl+'no-image.png';
  const imgElement = document.querySelector('.main-img img');
  imgElement.setAttribute("src", imgList);
  imgElement.removeAttribute("srcset")

  for (const key in data) {
    const elementName = key;
    const className = elementName.replace("::","")
    const dataValue = data[key]
    const elementTarget = document.querySelector(`.${className.toLowerCase()}`)
    if(elementTarget) {
      if( className == "webprice") {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        elementTarget.textContent = formatter.format(dataValue)
      } else {
          elementTarget.textContent = dataValue
      }
    }
  }
}

function loadImgdata(dataProperties) {
  const field = dataProperties?.children[7]?.textContent,
        id = `?id=${field}`
  fetch(urlPropertyImg+id, {
    method: 'GET'
    //credentials: 'user:passwd'
  })
  .then(response => response.text())
  .then(str => new DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data)
    const dataVendor = data.getElementsByTagName("record");
    const imgElement = document.querySelector(".main-img img")
    const imgData = dataVendor[0]?.children[11]?.textContent
    imgElement.setAttribute("src", `data:image/png;base64, ${imgData}`)
    imgElement.removeAttribute("srcset")
  })
}
