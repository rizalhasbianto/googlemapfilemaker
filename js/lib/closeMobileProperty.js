export function closeMobileProperty(markers,staticImgUrl) {
    const closeDetailMapView = document.querySelector(".filter-close-prop-list");
    const detailProperty = document.querySelector(".detail-property")
    closeDetailMapView.onclick = function() {
        const indexMarker = detailProperty.getAttribute("index")
        detailProperty.classList.remove("show");
        markers[indexMarker].setIcon(staticImgUrl+"property-marker.png");
        markers[indexMarker].setAnimation(null);
    }
}