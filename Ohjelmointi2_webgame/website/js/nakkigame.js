'use strict';

function FlytoCountry() { // player flies to country
    //this should do stuff on the map and call death chance and other stuff
    currentCountry = selectedCountry
    console.log("Flying!!")
}

function GetSosig() { //player obtains sausage
    //get sausage and do stuff
    currentCountry.setStyle(noSosigStyle)
    console.log('Sosig!!');
}

var map;

var selectedCountry;
var currentCountry;

map = L.map('map').setView([0,0],1); //makes a leaflet map

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    noWrap: true,
    maxBounds: [[90,180],[-90,-180]],
    minZoom: 1,
    maxZoom: 5,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
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

        const div = document.createElement("div");
        div.innerHTML = '<b>' + layer.feature.properties.name +'</b>';

        const button = document.createElement("button");
        button.innerHTML = "Fly to country";

        button.onclick = function () {
            FlytoCountry()
        }

        div.appendChild(button);

        return div
    }
    else if (layer.options.color == "#FF0000") { //if country doesnt contain a sausage anymore
        return "You have already eaten a sausage in "+layer.feature.properties.name+"."
    }
}).addTo(map);

document.getElementById('sosigButton').addEventListener('click', (e) => { //this is for the sausage search button
    GetSosig();
});