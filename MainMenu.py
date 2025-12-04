from flask import Flask, jsonify, Response
import mysql.connector
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

def get_scores():
    sqlresult = sqlquery("""
                         SELECT screen_name, difficulty, sausagenum, high_score, location
                         FROM game
                         ORDER BY high_score DESC
                         """)

    results = []
    for row in sqlresult:
        results.append({
            "screen_name": row[0],
            "difficulty": row[1],
            "sausagenum": row[2],
            "high_score": row[3],
            "location_at_death": row[4]
        })
    return results

@app.route("/scores")
def api_scores():
    scores = get_scores()
    return jsonify({"highscores": scores})


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
