/*import { useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png' 
*/
import './App.css'

import { useEffect, useState } from "react";

function App() {
  const [joes, setJoes] = useState([]);

  useEffect(() => {
    fetch("https://localhost:5116/api/joes") // 👈 we’ll fix port next
      .then(res => res.json())
      .then(data => setJoes(data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>GI Joe Characters</h1>

      {joes.map((joe) => (
        <div key={joe.id}>
          <h3>{joe.name}</h3>
          <p>{joe.specialty}</p>
        </div>
      ))}
    </div>
  );
}

export default App;