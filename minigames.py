from flask import Flask, jsonify, Response
import json
import time
import random

app = Flask(__name__)


def reaction_game():
    duration = random.randint(15, 20)
    start = time.time()

    best_reaction = None
    clicks = 0

    while time.time() - start < duration:
        reaction = random.uniform(0.1, 1.0)
        clicks += 1

        if best_reaction is None or reaction < best_reaction:
            best_reaction = reaction

    if best_reaction < 0.35:
        outcome = "winner"
    else:
        outcome = "loser"

    return {
        "duration": duration,
        "best_reaction": round(best_reaction, 3),
        "clicks": clicks,
        "outcome": outcome
    }


def quick_math_game():
    duration = random.randint(15, 20)
    start = time.time()

    score = 0

    while time.time() - start < duration:
        a = random.randint(1, 10)
        b = random.randint(1, 10)
        correct = a + b

        answer = random.randint(correct - 2, correct + 2)

        if answer == correct:
            score += 1

    if score >= 10:
        outcome = "winner"
    else:
        outcome = "loser"

    return {
        "duration": duration,
        "score": score,
        "outcome": outcome
    }


def guessing_game():
    duration = random.randint(15, 20)
    start = time.time()

    wins = 0
    attempts = 0

    while time.time() - start < duration:
        target = random.randint(1, 5)
        guess = random.randint(1, 5)

        attempts += 1
        if guess == target:
            wins += 1

    if wins >= 7:
        outcome = "winner"
    else:
        outcome = "loser"

    return {
        "duration": duration,
        "wins": wins,
        "attempts": attempts,
        "outcome": outcome
    }


@app.route("/minigame/reaction")
def api_reaction():
    return jsonify({
        "game": "reaction",
        "result": reaction_game()
    })


@app.route("/minigame/quickmath")
def api_quickmath():
    return jsonify({
        "game": "quickmath",
        "result": quick_math_game()
    })


@app.route("/minigame/guessing")
def api_guessing():
    return jsonify({
        "game": "guessing",
        "result": guessing_game()
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
    return "Mini Games API Running!"


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)


