// Getting Property Detail

document.addEventListener('DOMContentLoaded', function(event) {
  const url = 'https://yof5cw2m6rdd27h7nnwhg532dm0idkog.lambda-url.us-east-1.on.aws/single-json';
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const recId = urlParams.get('recId');
  const getPropertyData = sessionStorage.getItem(`singleProperty_${recId}`);

  if (getPropertyData && !getPropertyData == "undefined") {
    const propertyData = JSON.parse(getPropertyData);
    // load data into html
    initData(propertyData);
  } else {
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: recId })
      //credentials: 'user:passwd'
    })
      .then(response => response.json())
      .then(data => {
        // load data into html
        if (data.propData == "not found") {
          loadBigImgdata("abcd")
          document.querySelector(".fetch").style.display = "none"
          document.querySelector(".not-found").style.display = "block"
        } else {
          initData(data.propData);
        }
      })
  }
})

//Print data to html
function initData(data) {
  // hide or show loan data
  if (data.listingagentcompany) {
    const listingElement = document.querySelector('.listing');
    listingElement.style.display = "block"
  }
  if (data.gccompany) {
    const listingElement = document.querySelector('.contractor-w');
    listingElement.style.display = "block"
  }

  // load img to html
  loadBigImgdata(data.id)
  //const imgList = data.fullimagebase64 ? 'data:image/png;base64, ' + data.fullimagebase64 : staticImgUrl+'no-image.png';
  //const imgElement = document.querySelector('.main-img img');
  //imgElement.setAttribute("src", imgList);
  //imgElement.removeAttribute("srcset")
  const status = data.status
  for (const key in data) {
    const elementName = key;
    const className = elementName.replace("::", "")
    const dataValue = data[key]
    const elementTarget = document.querySelector(`.${className.toLowerCase()}`)
    if (elementTarget) {
      if (className == "webprice") {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        elementTarget.textContent = "";
        //if (status !== "Under Construction") {
        //  elementTarget.textContent = formatter.format(dataValue)
        //} else {
        //  elementTarget.textContent = "";
        //}
      } else {
        elementTarget.textContent = dataValue
      }
    }
  }
}

function hidePreLoad() {
  const skeletonElm = document.querySelectorAll('.skeleton-preload-wrap')
  for (let i = 0; i < skeletonElm.length; i++) {
    skeletonElm[i].style.display = "none";
  }
}

function loadBigImgdata(id) {
  console.log("data searcing")
  const bigImgUrl = 'https://yof5cw2m6rdd27h7nnwhg532dm0idkog.lambda-url.us-east-1.on.aws/big-img?id=';
  const staticImgUrl = "https://main.d7yn427fsa3k3.amplifyapp.com/img/";

  fetch(bigImgUrl + id, {
    method: 'GET'
    //credentials: 'user:passwd'
  })
    .then(response => response.json())
    .then(data => {
      const imgElement = document.querySelector('.main-img img');
      if (data.fullimg != "not found") {
        const imgList = data.fullimg ? 'data:image/png;base64, ' + data.fullimg : staticImgUrl + 'no-image.png';
        imgElement.setAttribute("src", imgList);
        imgElement.removeAttribute("srcset");
        setTimeout(function() {
          hidePreLoad()
        }, 500)
      } else {
        const imgList = staticImgUrl + 'no-image.png';
        imgElement.setAttribute("src", imgList);
        imgElement.removeAttribute("srcset");
        setTimeout(function() {
          hidePreLoad()
        }, 500)
      }
    })
}