import { useEffect, useState } from "react";

const URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

interface PokemonItem {
  name: string;
  url: string;
}

interface Pokemon {
  count: number;
  next: string | null; // Should be nullable
  previous: string | null; // Should be nullable
  results: PokemonItem[];
}

export default function List() {
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(URL);
        const data: Pokemon = await response.json();
        const names = data.results.map((pokemon) => pokemon.name);
        setPokemonNames(names);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPokemon(); // Call the async function
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="pokemon-list">
      <h2>Pokémon List</h2>
      <div className="button-grid">
        {pokemonNames.map((name, index) => (
          <button key={index} className="pokemon-button">
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
