import json
import os

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data.json")


def initialize_data_file():
    if not os.path.exists(DATA_FILE):
        example_path = os.path.join(BASE_DIR, "example_jsons", "data.json")
        if os.path.exists(example_path):
            try:
                with open(example_path, "r") as src, open(DATA_FILE, "w") as dst:
                    dst.write(src.read())
                return
            except Exception:
                pass
        # Fallback to hardcoded initial structure if copy fails
        try:
            initial_data = {"teams": {}, "matches": []}
            with open(DATA_FILE, "w") as f:
                json.dump(initial_data, f, indent=4)
        except Exception:
            pass


# Ensure data file exists on startup
initialize_data_file()


def load_data():
    if not os.path.exists(DATA_FILE):
        initialize_data_file()

    with open(DATA_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {"teams": {}, "matches": []}


def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify(load_data())


@app.route("/api/save", methods=["POST"])
def post_save():
    data = request.json
    if not data:
        return jsonify({"status": "error", "message": "No data received"}), 400
    save_data(data)
    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
