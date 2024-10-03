import {useEffect, useState } from "react";

const URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

interface Pokemon {
    name: string;
    url: string;
}
export default function Search() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<Pokemon | null>(null);
    const handleButtonClick = async () => {
        const response = await fetch(`${URL}`);
        const data: Pokemon = await response.json();
        console.log(data)
    }


    return (
        <div>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <br/><br/>
            <button 
                onClick={handleButtonClick}>
                List Pokemon
            </button>
        </div>
    );
}