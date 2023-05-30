function initMap(map) {
  if(window.innerWidth <= 600) {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: new google.maps.LatLng(47.60507343621495, -122.32353164431197),
      mapTypeId: "terrain",
      disableDefaultUI: true,
    });
  } else {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: new google.maps.LatLng(47.60507343621495, -122.32353164431197),
      mapTypeId: "terrain",
    });
  }
}

export { initMap }