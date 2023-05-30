function createScrollBar(target) {
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
    });
}

export { createScrollBar }