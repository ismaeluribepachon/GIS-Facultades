MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
MB_URL = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
var map = L.map('map').setView([40.4741953, -3.3791285], 14);
L.tileLayer(MB_URL, {
	attribution: MB_ATTR,
	id: 'mapbox.streets'
}).addTo(map);


L.Routing.control({
  waypoints: [
    L.latLng(40.4741953, -3.3791285),
    L.latLng(40.4841953, -3.3891285)
  ]
}).addTo(map);