import { getBigImgdata } from "./lib/getBigImgData.js";
const url = "https://yof5cw2m6rdd27h7nnwhg532dm0idkog.lambda-url.us-east-1.on.aws/featured"
const slideElm = document.querySelector(".swiper-wrapper");
const staticImgUrl = "https://main.d7yn427fsa3k3.amplifyapp.com/img/";

function createSliderItem(data) {
  const slideItem = slideElm.querySelector(".clone");
  for (let i = 0; i < data.length; i++) {
    const clone = slideItem.cloneNode(true);
    const desc = data[i].address1 + ", " +
      data[i].city + ", " +
      data[i].state + " " +
      data[i].postalcode;
    const imgList = data[i].thumbnailimagebase64 ?
      'data:image/png;base64, ' + data[i].thumbnailimagebase64 :
      staticImgUrl + 'no-image.png';
    clone.classList.remove("clone")
    clone.setAttribute("data-id", data[i].id);
    clone.childNodes[0].setAttribute("href", "/single-property?recId=" + data[i].id)
    clone.childNodes[0].childNodes[0].childNodes[0].setAttribute("src", imgList); // img
    clone.childNodes[0].childNodes[0].childNodes[0].removeAttribute("srcset"); // img
    clone.childNodes[0].childNodes[2].childNodes[0].textContent = data[i].neighborhood; // heading
    clone.childNodes[0].childNodes[2].childNodes[1].textContent = desc; // description
    slideElm.appendChild(clone)
  }
  const lastSlide = slideItem.cloneNode(false);
  lastSlide.classList.remove("clone")
  slideElm.appendChild(lastSlide)
}

if (slideElm) {
  fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      createSliderItem(data);
      const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: false,
        speed: 500,
        spaceBetween: 50,
        slidesPerView: 2,
      });
      loadBigImg(data)
    });
}

async function loadBigImg(data) {
  const slideItem = slideElm.querySelectorAll(".slider-item");
  if (slideItem.length > 0) {
    for (let i = 0; i < slideItem.length; i++) {
      const id = slideItem[i].getAttribute("data-id")
      if (id) {
        const imgData = await getBigImgdata(id, staticImgUrl)
        slideItem[i].childNodes[0].childNodes[0].childNodes[0].setAttribute("src", imgData);
      }
    }
  }
}