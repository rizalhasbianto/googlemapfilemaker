import { getBigImgdata } from "./getBigImgData.js";

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)

  );
}

export async function loadFirstBigImg() {
  const propList = document.querySelectorAll('.prop-list-wrap');
  const staticImgUrl = "https://main.d7yn427fsa3k3.amplifyapp.com/img/";

  for (let i = 0; i < 6; i++) {
    propList[i].setAttribute("img", true)
    const id = propList[i].getAttribute("id");
    const imgData = await getBigImgdata(id, staticImgUrl)
    const imgWrap = propList[i].querySelector(".img-wrap img")
    imgWrap.setAttribute("src", imgData)
  }
}

export async function loadBigImg(propItem, staticImgUrl) {
  const propOnView = isInViewport(propItem);
  const imgLoaded = propItem.getAttribute("img");
  const onMap = propItem.getAttribute("filter-map")
  if (!imgLoaded && propOnView && onMap == "include") {
    const id = propItem.getAttribute("id")
    const imgData = await getBigImgdata(id, staticImgUrl)
    const imgWrap = propItem.querySelector(".img-wrap img")
    imgWrap.setAttribute("src", imgData)
    propItem.setAttribute("img", true)
  }
}