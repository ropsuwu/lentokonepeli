'use strict';
let fullLatLng = L.latLngBounds([-90, -180], [90, 180]);
let planeAnimation;
let inPlaneAnim = false;
let planeSpeed = 50;
let curPlaneSpeed;
let planeSize = 5;
let aPos;
let bPos;
let lines = [];
let linesList = [];
let dash;
let dashTimer = 10;
let curDashTimer;
let sausagesFound = [];
let difficulty;
let difficultyValue;
let difficultyName;
let death;
let deathTimer;
let totalDistanceTravelled;
let currentAirportName;

function PlaneAnim() {
    if (!inPlaneAnim) {
        curPlaneSpeed = planeSpeed
        aPos = planeImg.getCenter()
        console.log("FlightStarted!!")
        inPlaneAnim = true
        dash = false
        curDashTimer = dashTimer
    } else if (inPlaneAnim) {
        //console.log(planeImg.getCenter())
        let latDif = planeImg.getCenter().lat - targetLatLng[0]
        //console.log(latDif)
        //console.log(targetLatLng)
        let lngDif = planeImg.getCenter().lng - targetLatLng[1]
        let totalDif = Math.abs(latDif) + Math.abs(lngDif)
        if (totalDif <= 0) {
            totalDif = 1
        }
        //console.log(totalDif)
        let planeDir = [latDif / totalDif, lngDif / totalDif]
        let newCenter = [planeImg.getCenter().lat - (planeDir[0] * (curPlaneSpeed / 60)), planeImg.getCenter().lng - (planeDir[1] * (curPlaneSpeed / 60))]

        let distanceChange = Math.abs(planeDir[0] * (curPlaneSpeed / 60)) + Math.abs(planeDir[1] * (curPlaneSpeed / 60))
        deathTimer -= distanceChange

        //console.log(deathTimer)
        if (deathTimer <= 0 && death) {
            Death()
        }

        //console.log(newCenter)
        let sMercatorLng = (Math.tan((Math.PI / 4) + (((Math.abs(newCenter[0] + planeSize) * Math.PI) / 180) / 2)))
        //console.log(newCenter[0] + ", " + (newCenter[0] * sMercatorLng))
        let newBounds = L.latLngBounds([newCenter[0] + (planeSize / (sMercatorLng * 1)), newCenter[1] + planeSize], [newCenter[0] - (planeSize / (sMercatorLng * 1)), newCenter[1] - planeSize])
        //console.log(newBounds)
        planeImg.setBounds(newBounds)
        //console.log(sMercatorLng)
        curPlaneSpeed = (planeSpeed / Math.max(2, sMercatorLng * 1)) * 3

        if (!dash) {
            bPos = planeImg.getCenter()
            let newLine = L.polyline([aPos, bPos], {color: "#FF0000"})
            lines.push(newLine)
            //console.log(lines)
            newLine.addTo(map)
            aPos = bPos
        } else if (dash) {
            bPos = planeImg.getCenter()
            let newLine = L.polyline([aPos, bPos], {color: "#FF0000", opacity: 0})
            lines.push(newLine)
            //console.log(lines)
            newLine.addTo(map)
            aPos = bPos
        }
        //console.log(lines.length)

        if (lines.length > 300) {
            for (let i = 0; lines.length > 300; i++) {
                map.removeLayer(lines[i])
                lines.splice(i, 1)
            }
        }

        if (lines.length > 300) {
            for (let i = 0; lines.length > 300; i++) {
                map.removeLayer(lines[i])
                lines.splice(i, 1)
            }
        }


        //console.log(sMercatorLng)
        curPlaneSpeed = (planeSpeed / Math.max(2, sMercatorLng * 1)) * 3
        curDashTimer -= 1
        if (curDashTimer <= 0) {
            dash = !dash
            curDashTimer = dashTimer
        }
        if (!dash && curDashTimer == dashTimer) {
            aPos = planeImg.getCenter()
        }


        if (Math.abs(newCenter[0] - targetLatLng[0]) < 1.5 && Math.abs(newCenter[1] - targetLatLng[1]) < 1.5) {
            //console.log(newCenter[0] - selectedLatLng.getCenter().lat, newCenter[1] - selectedLatLng.getCenter().lng)
            inPlaneAnim = false

            clearInterval(planeAnimation)
        } else {
            //console.log(newCenter[0] - selectedLatLng.getCenter().lat, newCenter[1] - selectedLatLng.getCenter().lng)
        }

    }
}

async function FlytoCountry() { // player flies to country
    //this should do stuff on the map and call death chance and other stuff
    currentCountry = selectedCountry
    console.log(currentCountry.feature.properties.name)
    const targetAirport = await fetch("http://127.0.0.1:5000/query?query=SELECT a.name, a.latitude_deg, a.longitude_deg, a.ident FROM airport a JOIN country c ON a.iso_country = c.iso_country WHERE a.type = 'large_airport' AND a.iso_country = '" + currentCountry.feature.properties.iso_a2_eh + "'")
    const json = await targetAirport.json()
    console.log(json)

    currentAirportName = json[0][0]
    targetLatLng = [json[0][1], json[0][2]]
    //targetLatLng = selectedLatLng

    let latDif = planeImg.getCenter().lat - targetLatLng[0]
    let lngDif = planeImg.getCenter().lng - targetLatLng[1]
    let totalDif = Math.abs(latDif) + Math.abs(lngDif)


    //Harvesine function
    const R = 6371e3; // metres
    const φ1 = planeImg.getCenter().lat * Math.PI / 180; // φ, λ in radians
    const φ2 = targetLatLng[0] * Math.PI / 180;
    const Δφ = (targetLatLng[0] - planeImg.getCenter().lat) * Math.PI / 180;
    const Δλ = (targetLatLng[1] - planeImg.getCenter().lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = (R * c) / 1000; // in kilometres

    totalDistanceTravelled += d

    let conf
    let chance = (difficultyValue * Math.pow((d) * (sausagesFound.length / 50), 0.8)) + 5000
    console.log(chance + ", " + sausagesFound.length+", "+d)


    if (chance >= 0) {
        //"this should add a confirmation prompt for the player"
        conf = "y"//placeholder
    }
    else {
        conf = "y"
    }
        
    if (conf == "y") {
        if ((Math.random() * 1000)-1 <= chance) {
            death = true
            deathTimer = Math.random() * totalDif
        }
        else {
            death = false
        }
    }
    else {
        death = "cancelled"
    }

    if (death != "cancelled") {
        planeAnimation = setInterval(PlaneAnim, 16.6666666)
    }
    //console.log("Flying!!")

}

let score
function Death() {
    clearInterval(planeAnimation)
    console.log("player has died")

    document.getElementById('menu-overlay').style.display = 'flex';
    document.getElementById('death-screen').classList.remove('hidden');

    console.log(totalDistanceTravelled)
    score = Math.floor(((Math.pow(difficultyValue, 2)) * sausagesFound.length * 100) / Math.log10(totalDistanceTravelled))

    document.getElementById('death-description').innerHTML = ("While on a flight to " + currentAirportName + ", located in " + currentCountry.feature.properties.name + ". You suffered- and subsequently died from a heart attack, likely caused by your unhealthy eating habits. <br> <br>" +
    "Your final score was "+score+".")
}

async function GetSosig() { //player obtains a sausage
    //get sausage and do stuff
    const nakki = await fetch("http://127.0.0.1:5000/query?query=SELECT sausage FROM country WHERE iso_country='" + currentCountry.feature.properties.iso_a2_eh + "'");
    //console.log(nakki)
    const json = await nakki.json();

    if (json[0][0] == undefined || json[0][0] == null) {
        console.log("ei nakkia")
        //currentCountry.setStyle(nofoundsosig)
        //ei nakkia
    } else {
        if (!inPlaneAnim) {
            if (!sausagesFound.includes(currentCountry) && currentCountry.options.color != "#FF0000") {
                document.getElementById('menu-overlay').style.display = 'flex';
                document.getElementById('difficulty-select').classList.add('hidden');
                document.getElementById('gameContainer').classList.remove('hidden');

                sosigJudgement(true)
                //showRandomGame();

                //console.log(json[0][0])
                //console.log('Sosig!!')
                //joo nakkia
            }
        }
    }

    //console.log("inPlaneAnim is "+inPlaneAnim)
    //if (!inPlaneAnim) {
    //    currentCountry.setStyle(noSosigStyle)
    //    console.log('Sosig!!')
    //}
}

function sosigJudgement(gameWinBool) {
    document.getElementById('menu-overlay').style.display = 'none';
    document.getElementById('gameContainer').classList.add('hidden');
    if (gameWinBool) {
        sausagesFound.push(currentCountry)
        currentCountry.setStyle(noSosigStyle)
    }
    else {
        //wip, should stop minigame retry maybe?
        currentCountry.setStyle(noSosigStyle)
    }
}

let map;

let selectedCountry;
let selectedLatLng;
let targetLatLng;
let currentCountry;//these should be set according to the starting country which is picked
let currentLatLng; //these should be set according to the starting country which is picked

map = L.map('map').setView([0, 0], 1); //makes a leaflet map

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
let nofoundsosig = {
    "color": "#a3a3a3",
    "weight": 2,
    "opacity": 0.9
}

let GeoJSON = L.geoJSON(globeGeojsonLayer, {style: sosigStyle}).bindPopup(function (layer) {
    if (layer.options.color == "#008000") { //if there is a sausage in the country
        selectedCountry = layer
        //console.log(selectedCountry)
        selectedLatLng = L.latLngBounds(layer._bounds._northEast, layer._bounds._southWest)// this should call flask to get the latLng of an airport in the country
        //console.log(selectedLatLng)


        const div = document.createElement("div");
        div.innerHTML = '<b>' + layer.feature.properties.name + '</b>';

        const button = document.createElement("button");
        button.innerHTML = "Fly to country";

        button.onclick = function () {
            if (!inPlaneAnim)
                FlytoCountry()
        }

        div.appendChild(button);

        return div
    }
    else if (layer.options.color == "#a3a3a3"){
        const div = document.createElement("div");
        div.innerHTML = '<b>' + layer.feature.properties.name + '</b>';

        const p = document.createElement("p");
        p.innerHTML = "There is no sausage to find here";

        div.appendChild(p);

        return div
    }
    //change the color if country doesn't contain a sausage
    if (sausagesFound.includes(currentCountry) || layer.options.color == "#FF0000") {
        return "You have already searched for sausages in " + layer.feature.properties.name + "."
    }
    //else if (layer.options.color == "#FF0000") {
    //    return "You have already eaten a sausage in "+layer.feature.properties.name+"."
    //}
}).addTo(map);

let planeImg;

//Event listener for the button
document.getElementById('button-main').addEventListener('click', async (e) => {
    GetSosig();

});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('newgame-btn').addEventListener('click',
        function () {
            document.getElementById('mainmenu').classList.add('hidden');
            document.getElementById('difficulty-select').classList.remove('hidden');
        });

    document.getElementById('settings-btn').addEventListener('click',
        function () {
            document.getElementById('mainmenu').classList.add('hidden');
            document.getElementById('settings').classList.remove('hidden');
        });
    document.getElementById('modifiers-btn').addEventListener('click',
        function () {
            document.getElementById('mainmenu').classList.add('hidden');
            document.getElementById('modifiers').classList.remove('hidden');
        });
    document.getElementById('help-btn').addEventListener('click',
        function () {
            document.getElementById('mainmenu').classList.add('hidden');
            document.getElementById('help').classList.remove('hidden');
        });

    document.getElementById('startgame-btn').addEventListener('click',
        async function () {
            difficulty = document.getElementById('difficulty').value;
            console.log(difficulty)
            const startingCountry = document.getElementById('starting-country').value.trim();
            const result = await fetch("http://127.0.0.1:5000/query?query=SELECT a.latitude_deg, a.longitude_deg FROM airport a JOIN country c ON a.iso_country = c.iso_country WHERE c.name = '" + startingCountry + "'")
            if (result.status == 404) {
                alert("Could not find country!");
                return;
            }
            if (!startingCountry) {
                alert("Please enter the name of a country!");
                return;
            }

            window.gameSettings = {
                difficulty: difficulty,
                startingCountry: startingCountry,
                modifier: window.selectedModifier || 'none'
            };
            startGameWithSettings();

            document.getElementById('menu-overlay').style.display = 'none';
        });
    document.getElementById('score-btn').addEventListener('click',
        async function () {
            let idCount = await fetch("http://127.0.0.1:5000/query?query=SELECT COUNT(*) FROM game")
            idCount = await idCount.json()
            console.log(idCount)
            idCount = idCount[0][0] + 1
            let scoreName = document.getElementById("score-name").value
            while (true) {
                let exists = await fetch(`http://127.0.0.1:5000/query?query=SELECT id FROM game WHERE id = ${idCount}`)
                if (exists.status != 404) {
                    idCount += 1
                }
                else {
                    break
                }
            }
            await fetch(`http://127.0.0.1:5000/query?query=INSERT INTO game VALUES (${idCount}, '${difficultyName}', ${sausagesFound.length},'${score}', '${scoreName}', '${currentAirportName}, ${currentCountry.feature.properties.name}')`)

            document.getElementById('mainmenu').classList.remove('hidden');
            document.getElementById('death-screen').classList.add('hidden');
        });
    setupBack();
});

function startGameWithSettings() {
    const settings = window.gameSettings;

    switch (settings.difficulty) {
        case "1":
            difficultyName = "vegan"
            difficultyValue = 0.3
            break
        case "2":
            difficultyName = "bland"
            difficultyValue = 1.0
            break
        case "3":
            difficultyName = "deep fried"
            difficultyValue = 2.0
            break
    }
    initializeGameWithCountry(settings.startingCountry);
}

async function initializeGameWithCountry(country) {
    console.log('Starting GAME with country:', country);
    totalDistanceTravelled = 0

    const result = await fetch("http://127.0.0.1:5000/query?query=SELECT a.latitude_deg, a.longitude_deg, a.iso_country FROM airport a JOIN country c ON a.iso_country = c.iso_country WHERE a.type = 'large_airport' AND c.name = '" + country + "'")
    const json = await result.json()
    currentLatLng = L.latLngBounds([[json[0][0] + 5, json[0][1] + 5], [json[0][0] - 5, json[0][1] - 5]])
    planeImg = L.imageOverlay("images/test.webp", currentLatLng).addTo(map)
    const nakki = await fetch("http://127.0.0.1:5000/query?query=SELECT iso_country FROM country WHERE sausage IS NULL");
    //console.log(nakki)
    const json2 = await nakki.json();
    let sosig
    console.log(json2)
    GeoJSON.eachLayer((layer) => {
        if (json[0][2] == layer.feature.properties.iso_a2_eh) {
            currentCountry = layer
        }
        //console.log(layer.feature.properties.iso_a2_eh)
        sosig=true
        for (let i = 0; i < json2.length; i++) {
            if (json2[i]==layer.feature.properties.iso_a2_eh) {
                sosig = false
                //ei nakkia
            }
        }
        if (!sosig) {
            layer.setStyle(nofoundsosig)
            //ei nakkia
        }
        else {
            layer.setStyle(sosigStyle)
            //joo nakkia
        }
    })
}

function setupBack() {
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.menu-screen').forEach(screen => {
                screen.classList.add('hidden');
            });
            document.getElementById('mainmenu').classList.remove('hidden');
        });
    });
}
