from flask import Flask, request, jsonify
from geopy import distance
import main
app = Flask(__name__)

def pelaajan_sijainti(currentAirport):
    return main.sqlquery(f"SELECT latitude_deg, longitude_deg FROM airport WHERE name = '{currentAirport}'")[0]

def get_large_airports():
    return main.sqlquery("SELECT a.name, c.name AS country_name, a.latitude_deg, a.longitude_deg, a.ident FROM airport a JOIN country c ON a.iso_country = c.iso_country WHERE a.type = 'large_airport'")

def find_nearest_large_airports(currentAirport, sausagesFound, limit=3):
    player_coords = pelaajan_sijainti(currentAirport)

    player_pos = (player_coords[0], player_coords[1])

    airports = get_large_airports()
    results = []

    for name, country, lat, lon, icao in airports:
        airport_pos = (lat, lon)
        dist_km = distance.distance(player_pos, airport_pos).kilometers

        # Pelaajan oma kenttä ohitetaan
        if dist_km == 0:
            continue

        if sausagesFound.__contains__(country):
            continue

        results.append((name, country, dist_km, icao))

    results.sort(key=lambda x: x[2])
    return results[:limit]

@app.route("/player/location")
def api_get_player_location():

    airport = request.args.get("airport")

    if not airport:
        return jsonify({"error": "Missing ?airport=<airport_name> parameter"}), 400

    location = pelaajan_sijainti(airport)

    if not location:
        return jsonify({"error": "Airport not found"}), 404

    return jsonify({
        "airport": airport,
        "latitude": location[0],
        "longitude": location[1]
    })

@app.route("/airports/nearest", methods=["POST"])
def api_get_nearest_airports():

    data = request.json or {}

    current_airport = data.get("currentAirport")
    sausages_found = data.get("sausagesFound", [])

    if not current_airport:
        return jsonify({"error": "currentAirport missing"}), 400

    nearest = find_nearest_large_airports(current_airport, sausages_found)

    if nearest is None:
        return jsonify({"error": "Airport not found"}), 404

    return jsonify({"nearest_airports": nearest})

@app.route("/")
def index():
    return "Flask API for Game Running!"

import json
from flask import Response

@app.after_request
def pretty_json(response):
    if response.content_type != "application/json":
        return response

    try:
        data = json.loads(response.get_data())
        pretty = json.dumps(data, indent=4, ensure_ascii=False)
        return Response(pretty, status=response.status_code, mimetype="application/json")
    except Exception:
        return response

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)

