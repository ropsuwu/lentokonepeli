from flask import Flask, request, jsonify, Response
import mysql.connector
import json

app = Flask(__name__)

# -------------------------------
# SQL-YHTEYS
# -------------------------------
sqlconnection = mysql.connector.connect(
    host='localhost',
    port='3306',
    database='flight_game',
    user='roope',
    password='nakki',
    autocommit=True
)


# -------------------------------
# LOGIIKKA /ensimatka varten
# -------------------------------
def ensimatka(country_name):
    cursor = sqlconnection.cursor()

    # Etsi maa
    cursor.execute("""
        SELECT name, iso_country 
        FROM country 
        WHERE LOWER(name) = %s
    """, (country_name.lower(),))

    rivi = cursor.fetchone()
    if not rivi:
        return None  # Maa ei löytynyt

    maan_nimi = rivi[0]
    iso_code = rivi[1]

    # Etsi first large airport
    cursor.execute("""
        SELECT name FROM airport
        WHERE iso_country = %s AND type = 'large_airport'
        LIMIT 1
    """, (iso_code,))

    kentta = cursor.fetchone()
    if not kentta:
        return {"country": maan_nimi, "airport": None}

    return {
        "country": maan_nimi,
        "airport": kentta[0]
    }


# -------------------------------
# /ensimatka ENDPOINT (GET, sama tyyli kuin /player/location)
# -------------------------------
@app.route("/ensimatka")
def api_ensimatka():

    country = request.args.get("country")

    if not country:
        return jsonify({"error": "Missing ?country=<country_name> parameter"}), 400

    result = ensimatka(country)

    if not result:
        return jsonify({"error": "Country not found"}), 404

    return jsonify(result)


# -------------------------------
# INDEX
# -------------------------------
@app.route("/")
def index():
    return "Flask API for Game Running!"


# -------------------------------
# PRETTY JSON - formatteri
# -------------------------------
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


# -------------------------------
# MAIN
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)



