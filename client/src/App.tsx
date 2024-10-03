import { useState, useEffect } from "react";
import './App.css';
import Dropdown from './components/Dropdown';

interface Pokemon {
  name: string;
  abilities: string;
  attack: string;
  defense: string;
  sp_attack: string;
  sp_defense: string;
  hp: string;
  speed: string;
  type1: string;
  type2: string | null;
  // more fields
}

interface UniqueFields {
  gen: string[];
  types: string[];
  is_legendary: string[];
}
function App() {

  const [activeTab, setActiveTab] = useState<'search' | 'filter'>('search');
  const [name, setName] = useState<string>('');
  const [pokemon, setPokemon] = useState<Pokemon[] | null>(null);
  const [matchingPokemon, setMatchingPokemon] = useState<Pokemon[] | null>(null);
  const [dropdownItems, setDropdownItems] = useState<UniqueFields | null>(null);
  const [error, setError] = useState('');
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string | null }>({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/unique_fields`);
        const data = await response.json();
        setDropdownItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTypes();
  }, [`http://127.0.0.1:8080/api/unique_fields`]);

  const fetchPokemon = async () => {

    fetch(`http://127.0.0.1:8080/api/pokemon?name=${name}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  };
  
  // Use useEffect to log when pokemon changes
  useEffect(() => {
    if (pokemon) {
        console.log('Current Pokémon Name:', pokemon[0]);
    } else {
        console.log('No Pokémon available.');
    }
  }, [pokemon]);

  const handleSelect = (id: string, item: string) => {
    setSelectedValues(prevState => ({
      ...prevState,
      [id]: item,
    }));
    console.log(id, item)
  };

  const handleSubmit = async () => {
    let url = 'http://127.0.0.1:8080/api/pokemon?';

    const params = [];

    // Check each selected value and add it to the params if it's not null
    if (selectedValues.dropdown1) {
      params.push(`generation=${encodeURIComponent(selectedValues.dropdown1)}`);
    }
    if (selectedValues.dropdown2) {
      params.push(`type1=${encodeURIComponent(selectedValues.dropdown2)}`);
    }
    if (selectedValues.dropdown3) {
      params.push(`type2=${encodeURIComponent(selectedValues.dropdown3)}`);
    }
    if (selectedValues.dropdown4 !== null) { // Check for null specifically
      params.push(`is_legendary=${encodeURIComponent(selectedValues.dropdown4)}`);
    }
    // Append the parameters to the base URL
    url += params.join('&');
      fetch(url, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setMatchingPokemon(data);
          console.log(data);
        })
        .catch((error) => console.log(error));
  };

  return (
      <div>
        <h1>Pokemon Test App</h1>
        <div className="tabs">
          <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active' : ''}>
            Search Individual Pokémon
          </button>
          <button onClick={() => setActiveTab('filter')} className={activeTab === 'filter' ? 'active' : ''}>
            Filter All Pokémon
          </button>
        </div>
      
        {activeTab === 'search' && (
          <div>
            <h2>Search an individual Pokemon</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Pokémon Name"
            /><br></br>
            <button onClick={fetchPokemon}>Fetch Pokémon</button>
            {error && <p>{error}</p>}
            <div>
              {pokemon ? (
                  <div>
                      <h2>{pokemon[0]['name']}</h2>
                      <p>
                        Abilities: {
                        typeof pokemon[0]['abilities'] === 'string' && pokemon[0]['abilities'] 
                          ? JSON.parse((pokemon[0]['abilities'] as string).replace(/'/g, '"')).join(', ') 
                          : "None"
                        }
                      </p>
                      <p>Type 1: {pokemon[0]['type1']}</p>
                      <p>Type 2: {pokemon[0]['type2'] ? pokemon[0]['type2'] : 'none'}</p>
                      <p>Stats: HP: {pokemon[0]['hp']}, Atk: {pokemon[0]['attack']}, Def: {pokemon[0]['defense']}, 
                        Sp.Atk: {pokemon[0]['sp_attack']}, Sp.Def: {pokemon[0]['sp_defense']}, Speed: {pokemon[0]['speed']}</p>
                   </div>
              ) : (
                  <p>No Pokémon fetched yet.</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'filter' && (
          <div>
            <h2>Filter for all Pokemon that match your criteria</h2>
            <div className="dropdown-container">
              {dropdownItems? (
              <>
                <div className="dropdown-item">
                  <p>Generation</p>
                  <Dropdown
                    id="dropdown1"
                    filterName='Gen' 
                    items={dropdownItems['gen']} 
                    onSelect={handleSelect}
                  />
                </div>
                <div className="dropdown-item">
                  <p>Type 1</p>
                  <Dropdown
                    id="dropdown2"
                    filterName='Type 1' 
                    items={dropdownItems['types']}
                    onSelect={handleSelect} 
                  />
                </div>
                <div className="dropdown-item">
                  <p>Type 2</p>
                  <Dropdown
                    id="dropdown3"
                    filterName='Type 2'
                    items={dropdownItems['types']}
                    onSelect={handleSelect}
                  />
                </div>
                <div className="dropdown-item">
                  <p>Is Legendary</p>
                  <Dropdown
                    id="dropdown4"
                    filterName='Is Legendary' 
                    items={dropdownItems['is_legendary']} 
                    onSelect={handleSelect}
                  />
                </div>
                <div className="dropdown-item">
                  <p>Search</p>
                  <button onClick={handleSubmit}>Go</button>
                </div>
              </>
              ) : (
                <p>No filter data</p>
              )} 
            </div>
            <div className="table-container">
              {/* Table to display matching Pokémon */}
              {matchingPokemon && matchingPokemon.length > 0 && (
                <div>
                  <h2>Matching Pokémon</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type 1</th>
                        <th>Type 2</th>
                        <th>HP</th>
                        <th>Attack</th>
                        <th>Defense</th>
                        <th>Sp.Attack</th>
                        <th>Sp.Defense</th>
                        <th>Speed</th>
                        <th>Abilities</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchingPokemon.map((poke, index) => (
                        <tr key={index}>
                          <td>{poke.name}</td>
                          <td>{poke.type1}</td>
                          <td>{poke.type2 ? poke.type2 : 'None'}</td>
                          <td>{poke.hp}</td>
                          <td>{poke.attack}</td>
                          <td>{poke.defense}</td>
                          <td>{poke.sp_attack}</td>
                          <td>{poke.sp_defense}</td>
                          <td>{poke.speed}</td>
                          <td>
                            {typeof poke.abilities === 'string'
                              ? JSON.parse(poke.abilities.replace(/'/g, '"')).join(', ')
                              : 'None'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>
    )}
  </div>
  );
}

export default App
