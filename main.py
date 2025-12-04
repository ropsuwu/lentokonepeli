from flask import Flask, request, jsonify, Response
import mysql.connector
from geopy import distance
import json

app = Flask(__name__)

sqlconnection = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='flight_game',
    user='roope',
    password='nakki',
    autocommit=True
)

def sqlquery(query):
    cursor = sqlconnection.cursor()
    cursor.execute(query)
    return cursor.fetchall()

def valimatka(icao1, icao2):
    loc1 = sqlquery(f"SELECT latitude_deg, longitude_deg FROM airport WHERE ident='{icao1}'")
    loc2 = sqlquery(f"SELECT latitude_deg, longitude_deg FROM airport WHERE ident='{icao2}'")

    if not loc1 or not loc2:
        return None

    coords1 = (loc1[0][0], loc1[0][1])
    coords2 = (loc2[0][0], loc2[0][1])

    return distance.distance(coords1, coords2).km

@app.route("/distance")
def api_distance():
    icao1 = request.args.get("from")
    icao2 = request.args.get("to")

    if not icao1 or not icao2:
        return jsonify({"error": "Missing ?from=<ICAO>&to=<ICAO> parameters"}), 400

    dist = valimatka(icao1, icao2)
    if dist is None:
        return jsonify({"error": "One or both ICAO codes not found"}), 404

    return jsonify({
        "from": icao1,
        "to": icao2,
        "distance_km": round(dist, 2)
    })


@app.after_request
def pretty_json(response):
    if response.content_type != "application/json":
        return response
    try:
        data = json.loads(response.get_data())
        pretty = json.dumps(data, indent=4, ensure_ascii=False)
        return Response(pretty, status=response.status_code, mimetype="application/json")
    except:
        return response


@app.route("/")
def index():
    return "Flight Game API running!"

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
