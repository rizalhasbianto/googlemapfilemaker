function itemLink(data) {
  const singleProLink = document.querySelectorAll('.properties .single-property-link');
  for (let i = 0; i < singleProLink.length; i++) {
    singleProLink[i].addEventListener("click", function(event) {
      event.preventDefault();
      const dataId = singleProLink[i].getAttribute("data-id")
      sessionStorage.setItem(`singleProperty_${dataId}`, JSON.stringify(data[i]));
      window.open(`./single-property?recId=${dataId}`);
    });
  }
}

function mobileViewLink(data) {
  const detailElm = document.querySelector('.detail-property');
  const mobileLink = detailElm.querySelector('.view-wrap .single-property-link');
  mobileLink.addEventListener("click", function(event) {
    event.preventDefault();
    const indexData = detailElm.getAttribute("data-id");
    const getSinglePropData = data.find(item => item.id === indexData)

    if (getSinglePropData) {
      sessionStorage.setItem(`singleProperty_${indexData}`, JSON.stringify(getSinglePropData));
    }

    window.open(`./single-property?recId=${indexData}`);
  });
}

export { itemLink, mobileViewLink }