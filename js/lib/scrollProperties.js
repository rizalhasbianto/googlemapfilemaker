// SCROLLBAR change function
function scrollbarChange() {
    const target = document.querySelector('.properties');
    const propertiesWraper = document.querySelector(".info");
    const filterElement = propertiesWraper.querySelector(".filter--wrapper");
    const scrollbarInput = document.querySelector('.scrollbar')
    const scrollinnerHeight = target.scrollHeight;
    const propertiesWraperHeight = propertiesWraper.clientHeight;
    const filterheight = filterElement.clientHeight;
    const totalscroll = (scrollinnerHeight-propertiesWraperHeight)+filterheight;
    scrollbarInput.setAttribute("max",totalscroll)
}

export { scrollbarChange }