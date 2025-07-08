from flask import Flask, send_from_directory, jsonify
import json

app = Flask(__name__, static_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/crops')
def crop_data():
    with open('data/crop-sim.json') as f:
        return jsonify(json.load(f))

if __name__ == '__main__':
    app.run(debug=True, port=8000)
