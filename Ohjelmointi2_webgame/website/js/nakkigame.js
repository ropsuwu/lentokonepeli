'use strict';
let fullLatLng = L.latLngBounds([-90, -180], [90, 180]);
let planeAnimation;
let inPlaneAnim = false;
let planeSpeed = 50;
let curPlaneSpeed
let planeSize = 5;
let aPos;
let bPos;
let lines = [];
let dash;
let dashTimer = 10;
let curDashTimer;
function PlaneAnim() {
    if (!inPlaneAnim) {
        curPlaneSpeed = planeSpeed
        aPos = planeImg.getCenter()
        console.log("FlightStarted!!")
        inPlaneAnim = true
        dash = false
        curDashTimer = dashTimer
    }
    else if (inPlaneAnim) {
        //console.log(planeImg.getCenter())
        let latDif = planeImg.getCenter().lat - targetLatLng.getCenter().lat
        let lngDif = planeImg.getCenter().lng - targetLatLng.getCenter().lng
        let totalDif = Math.abs(latDif) + Math.abs(lngDif)
        let planeDir = [latDif / totalDif, lngDif / totalDif]
        let newCenter = [planeImg.getCenter().lat - (planeDir[0] * (curPlaneSpeed / 60)), planeImg.getCenter().lng - (planeDir[1] * (curPlaneSpeed / 60))]

        //console.log(newCenter)
        let sMercatorLng = (Math.tan((Math.PI / 4) + (((Math.abs(newCenter[0]+planeSize) * Math.PI) / 180) / 2)))
        //console.log(newCenter[0] + ", " + (newCenter[0]*sMercatorLng))
        let newBounds = L.latLngBounds([newCenter[0] + (planeSize / (sMercatorLng * 1)), newCenter[1] + planeSize], [newCenter[0] - (planeSize / (sMercatorLng * 1)), newCenter[1] - planeSize])
        //console.log(newBounds)
        planeImg.setBounds(newBounds)
        console.log(sMercatorLng)
        curPlaneSpeed = (planeSpeed / Math.max(2, sMercatorLng*1))*3

        if (!dash) {
            bPos = planeImg.getCenter()
            let newLine = L.polyline([aPos, bPos], { color: "#FF0000" })
            lines.push[newLine]
            newLine.addTo(map)
            aPos = bPos
        }
        else if (dash) {

        }
        curDashTimer -= 1 
        if (curDashTimer <= 0) {
            dash = !dash
            curDashTimer = dashTimer
        }
        if (!dash&&curDashTimer==dashTimer) {
            aPos = planeImg.getCenter()
        }


        if (Math.abs(newCenter[0] - targetLatLng.getCenter().lat) < 1.5 && Math.abs(newCenter[1] - targetLatLng.getCenter().lng) < 1.5) {
            //console.log(newCenter[0] - selectedLatLng.getCenter().lat, newCenter[1] - selectedLatLng.getCenter().lng)
            inPlaneAnim=false
            clearInterval(planeAnimation)
        }
        else {
            //console.log(newCenter[0] - selectedLatLng.getCenter().lat, newCenter[1] - selectedLatLng.getCenter().lng)
        }
    }
}

function FlytoCountry() { // player flies to country
    //this should do stuff on the map and call death chance and other stuff
    currentCountry = selectedCountry
    targetLatLng = selectedLatLng
    planeAnimation = setInterval(PlaneAnim, 16.6666666)
    console.log("Flying!!")
}

function GetSosig() { //player obtains sausage
    //get sausage and do stuff
    if (!inPlaneAnim) {
        currentCountry.setStyle(noSosigStyle)
        console.log('Sosig!!')
    }
}

let map;

let selectedCountry;
let selectedLatLng; 
let targetLatLng;
let currentCountry;//these should be set according to the starting country which is picked
let currentLatLng; //these should be set according to the starting country which is picked
currentLatLng = L.latLngBounds([[0, 0], [0, 0]]);//debug

map = L.map('map').setView([0,0],1); //makes a leaflet map

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    noWrap: true,
    maxBounds: [fullLatLng],
    minZoom: 1,
    maxZoom: 5,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
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
        //console.log(selectedCountry)
        selectedLatLng = L.latLngBounds(layer._bounds._northEast, layer._bounds._southWest)// this should call flask to get the latLng of an airport in the country
        //console.log(selectedLatLng)
        

        const div = document.createElement("div");
        div.innerHTML = '<b>' + layer.feature.properties.name +'</b>';

        const button = document.createElement("button");
        button.innerHTML = "Fly to country";

        button.onclick = function () {
            if (!inPlaneAnim)
            FlytoCountry()
        }

        div.appendChild(button);

        return div
    }
    else if (layer.options.color == "#FF0000") { //if country doesnt contain a sausage anymore
        return "You have already eaten a sausage in "+layer.feature.properties.name+"."
    }
}).addTo(map);

let planeImg = L.imageOverlay("images/test.webp", currentLatLng).addTo(map)

document.getElementById('sosigButton').addEventListener('click', (e) => { //this is for the sausage search button
    GetSosig();
});

document.querySelectorAll('.advert').forEach(ad => {
    ad.addEventListener('click',function () {
        const adUrl = this.getAttribute('data-ad-url');
        if (adUrl) {
            window.open(adUrl, '_blank');
        }
        }
    );
});