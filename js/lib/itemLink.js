function itemLink(data) {
    const singleProLink = document.querySelectorAll('.properties .single-property-link');
    for (let i = 0; i < singleProLink.length; i++) {
        singleProLink[i].addEventListener("click", function(event){ 
            event.preventDefault();
            sessionStorage.setItem(`singleProperty_${i}`, JSON.stringify(data[i]));
            window.open(`./single-property?recId=${i}`);
        });
    }
}

function mobileViewLink(data) {
    const detailElm = document.querySelector('.detail-property');
    const mobileLink = detailElm.querySelector('.view-wrap .single-property-link');
    mobileLink.addEventListener("click", function(event){ 
      const indexData = detailElm.getAttribute("index")
        event.preventDefault();
        sessionStorage.setItem(`singleProperty_${indexData}`, JSON.stringify(data[indexData]));
        window.open(`./single-property?recId=${indexData}`);
    });
}

export { itemLink, mobileViewLink }