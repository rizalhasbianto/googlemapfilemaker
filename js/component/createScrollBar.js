import { getBigImgdata } from "../lib/getBigImgdata.js"

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  
    );
  }

function createScrollBar(target,staticImgUrl) {
    const scrollbarWraper = document.querySelector(".scroll-fake");
    const propertiesWraper = document.querySelector(".info");
    const filterElement = propertiesWraper.querySelector(".filter--wrapper");
    var scrollbar = document.createElement("input");
    const scrollinnerHeight = target.scrollHeight;
    const propertiesWraperHeight = propertiesWraper.clientHeight;
    const filterheight = filterElement.clientHeight;
    const totalscroll = ( scrollinnerHeight-propertiesWraperHeight ) + filterheight;
    Object.assign(scrollbar, {
        id: 'scrollbar-miror',
        className: "scrollbar",
        type: 'range',
        min: 0,
        max:totalscroll,
        style:`width:${propertiesWraperHeight-filterheight}px;`,
        oninput: function () {
        propertiesWraper.scrollTop = this.value
        },
    })

    scrollbarWraper.appendChild(scrollbar)
    propertiesWraper.addEventListener("scroll", function() {
        scrollbar.value = this.scrollTop;

        for(let i = 0; i < propertiesWraper.length; i++ ) {
            const propOnView = isInViewport(propertiesWraper[i]);
            const imgLoaded = propertiesWraper[i].getAttribute("img")
            if(!imgLoaded && propOnView) {
              const id = propertiesWraper[i].getAttribute("id")
              getBigImgdata(id, staticImgUrl)
              propertiesWraper[i].setAttribute("img",true);
            }
        }
    });
}

export { createScrollBar }
