'use strict';
let fullLatLng = L.latLngBounds([-90, -180], [90, 180]);
let planeAnimation;
let inPlaneAnim = false;
let planeSpeed;
let planeSize;
let planeImg;
let i = 0;
function PlaneAnim() {
    if (!inPlaneAnim) {
        planeSpeed = 50
        planeSize = 5
        planeImg = L.imageOverlay("images/test.png", currentLatLng).addTo(map)
        console.log("planeAdded")
        inPlaneAnim = true
    }
    else if (inPlaneAnim) {
        //console.log(planeImg.getCenter())
        let latDif = planeImg.getCenter().lat - selectedLatLng.getCenter().lat
        let lngDif = planeImg.getCenter().lng - selectedLatLng.getCenter().lng
        let totalDif = Math.abs(latDif) + Math.abs(lngDif)
        let planeDir = [latDif / totalDif, lngDif / totalDif]
        let newCenter = [planeImg.getCenter().lat - (planeDir[0] * (planeSpeed / 60)), planeImg.getCenter().lng - (planeDir[1] * (planeSpeed / 60))]
        //console.log(newCenter)
        let newBounds = L.latLngBounds([newCenter[0] + planeSize, newCenter[1] + planeSize], [newCenter[0] - planeSize, newCenter[1] - planeSize])
        //console.log(newBounds)
        planeImg.setBounds(newBounds)
        if (Math.abs(newCenter[0] - selectedLatLng.getCenter().lat) < 1 && Math.abs(newCenter[1] - selectedLatLng.getCenter().lng) < 1) {
            console.log(newCenter[0] - selectedLatLng.getCenter().lat, newCenter[1] - selectedLatLng.getCenter().lng)
            clearInterval(planeAnimation)
        }
        else {
            console.log(newCenter[0] - selectedLatLng.getCenter().lat, newCenter[1] - selectedLatLng.getCenter().lng)
        }
    }
}

function FlytoCountry() { // player flies to country
    //this should do stuff on the map and call death chance and other stuff
    currentCountry = selectedCountry
    planeAnimation = setInterval(PlaneAnim, 16.6666666)
    console.log("Flying!!")
}

function GetSosig() { //player obtains sausage
    //get sausage and do stuff
    currentCountry.setStyle(noSosigStyle)
    console.log('Sosig!!')
}

let map;

let selectedCountry;
let selectedLatLng; 
let currentCountry;//these should be set according to the starting country which is picked
let currentLatLng; //these should be set according to the starting country which is picked
currentLatLng = L.latLngBounds([[0,0],[0,0]]);//debug

map = L.map('map').setView([0,0],1); //makes a leaflet map

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    maxBounds: [fullLatLng],
    minZoom: 1,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map); //adds the GeoJSON data to the leaflet map

let sosigStyle = {
    "color": "#008000",//green
    "weight": 2,
    "opacity": 0.9
};
let noSosigStyle = {
    "color": "#FF0000",//red
    "weight": 2,
    "opacity": 0.9
};

L.geoJSON(globeGeojsonLayer, { style: sosigStyle }).bindPopup(function (layer) {
    if (layer.options.color == "#008000") { //if there is a sausage in the country
        selectedCountry = layer
        console.log(selectedCountry)
        selectedLatLng = L.latLngBounds(layer._bounds._northEast, layer._bounds._southWest)// this should call flask to get the latLng of an airport in the country
        console.log(selectedLatLng)
        

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