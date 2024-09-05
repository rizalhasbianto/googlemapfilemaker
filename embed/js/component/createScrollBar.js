import { loadBigImg } from "../lib/loadBigImg.js";

function createScrollBar(target, staticImgUrl) {
  const scrollbarWraper = document.querySelector(".scroll-fake");
  const propertiesWraper = document.querySelector(".info");
  const filterElement = propertiesWraper.querySelector(".filter--wrapper");
  const scrollbar = document.createElement("input");
  const scrollinnerHeight = target.scrollHeight;
  const propertiesWraperHeight = propertiesWraper.clientHeight;
  const filterheight = filterElement.clientHeight;
  const totalscroll = (scrollinnerHeight - propertiesWraperHeight) + filterheight;
  Object.assign(scrollbar, {
    id: 'scrollbar-miror',
    className: "scrollbar",
    type: 'range',
    value: 0,
    min: 0,
    max: totalscroll,
    style: `width:${propertiesWraperHeight - filterheight}px;`,
    oninput: function() {
      propertiesWraper.scrollTop = this.value
    },
  })

  scrollbarWraper.appendChild(scrollbar);
  const propItem = propertiesWraper.querySelectorAll(".prop-list-wrap")
  propertiesWraper.addEventListener("scroll", async function() {
    scrollbar.value = this.scrollTop;
    for (let i = 0; i < propItem.length; i++) {
      loadBigImg(propItem[i], staticImgUrl)
    }
  });
}

export { createScrollBar }