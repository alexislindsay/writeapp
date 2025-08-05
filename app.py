import json
import os
from flask import Flask, jsonify, abort

app = Flask(__name__)
DATA_FILE = os.environ.get("DATA_FILE", "chunks.json")

if os.path.exists(DATA_FILE):
    with open(DATA_FILE) as f:
        CHUNKS = json.load(f)
else:
    CHUNKS = []

@app.route("/chunks")
def get_chunks():
    return jsonify(CHUNKS)

@app.route("/chunk/<int:index>")
def get_chunk(index: int):
    if 0 <= index < len(CHUNKS):
        return jsonify(CHUNKS[index])
    return abort(404)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
