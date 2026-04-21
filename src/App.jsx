
import './App.css'

import { useEffect, useState } from "react";

function App() {
  const [joes, setJoes] = useState([]);

 useEffect(() => {
  fetch("http://localhost:5116/api/joes")
    .then(res => res.json())
    .then(data => {
      console.log("API DATA:", data);
      setJoes(data)
     })
    .catch(err => console.error("API error:", err));
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