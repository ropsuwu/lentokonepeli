from flask import Flask, request, jsonify

app = Flask(__name__)

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

