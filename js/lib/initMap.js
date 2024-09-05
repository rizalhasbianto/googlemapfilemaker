function initMap() {
  if (window.innerWidth <= 600) {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: new google.maps.LatLng(47.60507343621495, -122.32353164431197),
      mapTypeId: "terrain",
      disableDefaultUI: true,
      gestureHandling: "greedy",
    });
  } else {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: new google.maps.LatLng(47.60507343621495, -122.32353164431197),
      mapTypeId: "terrain",
    });
  }
}

export { initMap }