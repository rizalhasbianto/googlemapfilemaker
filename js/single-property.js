// Getting Property Detail
const urlPropertyDetail = 'https://BluePrintMap.hellomuto.repl.co/property-detail',
      urlPropertyVendor = 'https://BluePrintMap.hellomuto.repl.co/loan-detail',
      urlPropertyImg = 'https://BluePrintMap.hellomuto.repl.co/img-detail',
      queryString = window.location.search,
      urlParams = new URLSearchParams(queryString),
      recId = `?recId=${urlParams.get('recId')}`

fetch(urlPropertyDetail+recId, {
  method: 'GET'
  //credentials: 'user:passwd'
})
.then(response => response.text())
.then(str => new DOMParser().parseFromString(str, "text/xml"))
.then(data => {
  //console.log(data)
  const dataProperties = data.getElementsByTagName("record");
  initData(dataProperties[0])
  loadLoanData(dataProperties[0])
  loadImgdata(dataProperties[0])
})

function loadLoanData(dataProperties) {
  const field = dataProperties?.children[6]?.textContent,
        loanId = `?loanId=${field}`
  fetch(urlPropertyVendor+loanId, {
    method: 'GET'
    //credentials: 'user:passwd'
  })
  .then(response => response.text())
  .then(str => new DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const dataVendor = data.getElementsByTagName("record");
    const vendorTarget = document.querySelector(".vendor")
    for (let i = 0; i < dataVendor.length; i++) {
      console.log(dataVendor[i])
      var wraper = document.createElement("div")  
      wraper.className = "vendor-list"
      wraper.innerHTML = `
        <h2 class="vendor-role">${dataVendor[i].children[0]?.textContent}</h2>
        <h3 class="vendor-name">${dataVendor[i].children[6]?.textContent}</h3>
        <p class="vendor-detail">${dataVendor[i].children[3]?.textContent}</p>
        <p class="vendor-phone">${dataVendor[i].children[9]?.textContent}</p>
        <p class="vendor-email">${dataVendor[i].children[4]?.textContent}</p>
        `;
      vendorTarget.appendChild(wraper)
    }
  })
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

//Print data to html
function initData(data) {
  const propertyData = data?.children;

  for (let i = 0; i < propertyData.length; i++) {
    const elementName = propertyData[i].getAttribute("name");
    const className = elementName.replace("::","")
    const dataValue = propertyData[i]?.textContent
    const elementTarget = document.querySelector(`.${className.toLowerCase()}`)
    if(elementTarget) {
      if( className == "z_WebPrice") {
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
