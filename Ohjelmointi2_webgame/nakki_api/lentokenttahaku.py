import mysql.connector
from geopy import distance
from flask import Flask, request, jsonify, Response
import json

app = Flask(__name__)

yhteys = mysql.connector.connect(
    host='127.0.0.1',
    port=3306,
    database='flight_game',
    user='roope',
    password='nakki',
    autocommit=True
)

def pelaajan_sijainti(player_id):
    kursori = yhteys.cursor()
    sql = """SELECT a.latitude_deg, a.longitude_deg 
             FROM game g 
             JOIN airport a ON g.location = a.ident 
             WHERE g.id = %s"""
    kursori.execute(sql, (player_id,))
    return kursori.fetchone()


def get_large_airports():
    kursori = yhteys.cursor()
    sql = """SELECT a.name, c.name AS country_name, 
                    a.latitude_deg, a.longitude_deg 
             FROM airport a 
             JOIN country c ON a.iso_country = c.iso_country 
             WHERE a.type = 'large_airport'"""
    kursori.execute(sql)
    return kursori.fetchall()


def find_nearest_large_airports(player_id, limit=3):
    player_coords = pelaajan_sijainti(player_id)

    if not player_coords:
        return None

    player_pos = (player_coords[0], player_coords[1])

    kursori = yhteys.cursor()
    kursori.execute("SELECT location FROM game WHERE id = %s", (player_id,))
    row = kursori.fetchone()
    if not row:
        return None

    player_airport_ident = row[0]

    airports = get_large_airports()
    results = []

    for name, country, lat, lon in airports:
        dist_km = distance.distance(player_pos, (lat, lon)).kilometers

        # Pelaajan oma lentokenttä ohitetaan
        if dist_km == 0:
            continue

        results.append({
            "airport": name,
            "country": country,
            "distance_km": dist_km
        })

    # Järjestetään etäisyyden mukaan
    results.sort(key=lambda x: x["distance_km"])
    return results[:limit]

@app.route("/player/location")
def api_get_player_location():
    player_id = request.args.get("id")

    if not player_id:
        return jsonify({"error": "Missing ?id=<player_id> parameter"}), 400

    loc = pelaajan_sijainti(player_id)

    if not loc:
        return jsonify({"error": "Player not found"}), 404

    return jsonify({
        "player_id": player_id,
        "latitude": loc[0],
        "longitude": loc[1]
    })

@app.route("/airports/nearest")
def api_get_nearest_airports():
    player_id = request.args.get("id")

    if not player_id:
        return jsonify({"error": "Missing ?id=<player_id> parameter"}), 400

    nearest = find_nearest_large_airports(player_id)

    if not nearest:
        return jsonify({"error": "Player not found or airports unavailable"}), 404

    return jsonify({"nearest_airports": nearest})

@app.route("/airports/large")
def api_get_large_airports():
    airports = get_large_airports()

    if not airports:
        return jsonify({"error": "No large airports found"}), 404

    result = [
        {
            "airport": a[0],
            "country": a[1],
            "latitude": a[2],
            "longitude": a[3]
        }
        for a in airports
    ]

    return jsonify(result)

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
