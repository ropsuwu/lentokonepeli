'use strict';

function FlytoCountry() { // player flies to country
    //this should do stuff on the map and call death chance and other stuff
    currentCountry = selectedCountry
}

function GetSosig() { //player obtains sausage
    //get sausage and do stuff
    currentCountry.setStyle(noSosigStyle)
}

var map;

var selectedCountry;
var currentCountry;

map = L.map('map').setView([0,0],1); //makes a leaflet map

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    maxBounds: [[90,180],[-90,-180]],
    minZoom: 1,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map); //adds the GeoJSON data to the leaflet map

var sosigStyle = {
    "color": "#008000",//green
    "weight": 5,
    "opacity": 0.9
};
var noSosigStyle = {
    "color": "#FF0000",//red
    "weight": 5,
    "opacity": 0.9
};

L.geoJSON(globeGeojsonLayer, { style: sosigStyle }).bindPopup(function (layer) {
    if (layer.options.color == "#008000") { //if there is a sausage in the country
        selectedCountry = layer
        //DEBUG
        FlytoCountry()
        GetSosig()
        //
        return layer.feature.properties.name
    }
    else if (layer.options.color == "#FF0000") { //if country doesnt contain a sausage anymore
        return "You have already eaten a sausage in "+layer.feature.properties.name+"."
    }
}).addTo(map);
//globeGeojsonLayer.addTo(map);