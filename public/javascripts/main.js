MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
MB_URL = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
var map;
var posicion;

geolocation();

function geolocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition, errorPosition);
	}else{
		errorPosition(0);
	}
	
}

function showPosition(position){
	posicion = {lat: position.coords.latitude, lng: position.coords.longitude};
	console.log("latitud: "+position.coords.latitude);
	console.log("longitud: "+position.coords.longitude);
	map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 18);
	L.tileLayer(MB_URL, {
		attribution: MB_ATTR,
		id: 'mapbox.streets'
	}).addTo(map);

	var point = L.icon({
		iconUrl: '/images/punto.png',
		iconSize: [30, 30]
	});

	var marker = L.marker([position.coords.latitude, position.coords.longitude], {icon:point}).addTo(map);


	ajax({
		url: "api/facultad",
		data:{},
		method: "GET",
		ready: function(response){
			var res = JSON.parse(response);
			var datalist = document.querySelector("#lFac");
			for (var i = 0; i < res.length; i++) {
				var option = document.createElement("option");
				option.text = res[i].id;
				option.value = res[i].name;
				datalist.appendChild(option);
				addPoint(res[i].y, res[i].x, res[i].id);
			}
		}
	});

}

function errorPosition(err){
	if(err.code == 2){
		alert("No se puede obtener la ubicación.");
	}else if(err.code == 1){
		console.log("Le has dado a no.");
	}
	var position = {coords: {latitude: 40.4819791, longitude: -3.3635420999999996}};
	posicion = {lat: 40.4819791, lng: -3.3635420999999996};
	showPosition(position);
}

function generateRoute(a, b){
	L.Routing.control({
		waypoints: [
			L.latLng(a.lat, a.lon),
			L.latLng(b.lat, b.lon)
		]
	}).addTo(map);
}

function addPoint(lat, lon, id){
	var marker = L.marker([lat, lon], {alt : id});
	marker.on("click", function(event){
		map.setView([event.target._latlng.lat, event.target._latlng.lng]);
		ajax({
			url: "api/facultad",
			data: {id: event.target.options.alt},
			method: "GET",
			ready: function(response){
				console.log(response);
			}
		});
		console.log(event.target);
	});
	marker.addTo(map);
}

function ajax(obj){
	var url = obj.url;
	var data = obj.data;
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4 && xhttp.status == 200){
			obj.ready(xhttp.responseText);
		}
	}

	var dataKeys = Object.keys(data);
	if(dataKeys.length != 0){
		url += "?";
		for(var key in data){
			url += key+"="+data[key]+"&";
		}
		url.slice(0,-1);
	}

	xhttp.open(obj.method, url, true);
	xhttp.send();
}