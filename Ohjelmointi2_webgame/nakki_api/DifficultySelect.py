from flask import Flask, request, jsonify

app = Flask(__name__)

def choosedifficulty(difficulty):
    difficulty = difficulty.lower()

    if difficulty == "1" or difficulty == "vegan":
        return {"name": "vegan", "value": 0.3}

    if difficulty == "2" or difficulty == "bland":
        return {"name": "bland", "value": 1.0}

    if difficulty == "3" or difficulty == "deep fried":
        return {"name": "deep fried", "value": 2.0}

    return None


@app.route('/difficulty')
def api_choose_difficulty():
    #data = request.json
    data = {"difficulty":"1"}

    difficulty = data["difficulty"]
    if not difficulty:
        return jsonify({"error": "Missing field: difficulty"}), 400

    result = choosedifficulty(difficulty)

    if not result:
        return jsonify({"error": "Invalid difficulty"}), 400

    return jsonify(result)

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)