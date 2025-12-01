'use strict';
var map;

map = L.map('map').setView([0,0],1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    maxBounds: [[90,180],[-90,-180]],
    minZoom: 1,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var sosigStyle = {
    "color": "#008000",
    "weight": 5,
    "opacity": 0.9
};
var noSosigStyle = {
    "color": "#FF0000",
    "weight": 5,
    "opacity": 0.9
};

L.geoJSON(globeGeojsonLayer, { style: sosigStyle }).bindPopup(function (layer) {
    layer.setStyle(noSosigStyle)
    return layer.feature.properties.name
}).addTo(map);
//globeGeojsonLayer.addTo(map);