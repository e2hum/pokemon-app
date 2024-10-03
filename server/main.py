from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
cors = CORS(app, origins='*')

pokemon_data = pd.read_csv('./data/pokemon.csv')

@app.route("/api/pokemon", methods=['GET'])
def get_pokemon():
    # Get user input from query params
    name = request.args.get('name')
    generation = request.args.get('generation')
    type1 = request.args.get('type1')
    type2 = request.args.get('type2')
    is_legendary = request.args.get('is_legendary')
    # Start with the full dataset
    filtered_data = pokemon_data.copy()

    # Initialize a mask with True for all rows
    mask = pd.Series([True] * len(filtered_data))
    # Apply filters based on provided arguments
    if name:
        mask &= filtered_data['name'].str.lower() == name.lower()

    if generation:
        mask &= filtered_data['generation'] == int(generation) # Ensure same type

    if type1:
        mask &= filtered_data['type1'] == type1  # Ensure same type

    if type2:
        mask &= filtered_data['type2'] == type2  # Ensure same type

    if is_legendary is not None:  # Check for non-empty but allow "False" as a valid input
        mask &= filtered_data['is_legendary'] == int(is_legendary)

    # Apply the combined mask to filter data
    filtered_data = filtered_data[mask]

    # Check if filtered data is empty
    if not filtered_data.empty:
        # Replace all NaN values with None
        # Replace actual NaN and string representations of NaN with None
        filtered_data = filtered_data.fillna(value="N/A")

        # Return the filtered data as JSON
        return jsonify(filtered_data.to_dict(orient='records')), 200

    return jsonify({'error': 'No results found for the given criteria'}), 404

@app.route('/api/unique_fields', methods=['GET'])
def get_unique_fields():
    unique_types = pokemon_data['type1'].unique().tolist()
    unique_gen = pokemon_data['generation'].unique().tolist()
    unique_legendary = pokemon_data['is_legendary'].unique().tolist()

    unique_fields = {
        'types': unique_types,
        'gen': unique_gen,
        'is_legendary': unique_legendary,
    }
    if unique_fields:
        return jsonify(unique_fields)
    return jsonify({'error': 'Pokémon types not found'}), 404

if __name__ == "__main__":
    app.run(debug=True, port=8080)
