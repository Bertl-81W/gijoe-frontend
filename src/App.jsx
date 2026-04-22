import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [joes, setJoes] = useState([]);
  const [name, setName] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [specialty, setSpecialty] = useState("");

 useEffect(() => {
  fetch("http://localhost:5116/api/joes")
    .then(res => res.json())
    .then(data => {
      console.log("API DATA:", data);
      setJoes(data)
     })
    .catch(err => console.error("API error:", err));
}, []);

const handleSubmit = (e) => {
  e.preventDefault();

  const newJoe = {
    name,
    placeOfBirth,
    specialty
  };

  fetch("http://localhost:5116/api/joes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newJoe)
  })
    .then(res => res.json())
    .then(data => {
      setJoes([...joes, data]);
      setName("");
      setPlaceOfBirth("");
      setSpecialty("");
    })
    .catch(err => console.error(err));
};

  return (
    <div>
      <h1>GI Joe Characters</h1>

       <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    type="text"
    placeholder="Place of Birth"
    value={placeOfBirth}
    onChange={(e) => setPlaceOfBirth(e.target.value)}
  />

  <input
    type="text"
    placeholder="Specialty"
    value={specialty}
    onChange={(e) => setSpecialty(e.target.value)}
  />

  <button type="submit">Add Joe</button>
</form>

      {Array.isArray(joes) && joes.map((joe) => (
        <div key={joe.id}>
          <h3>{joe.name}</h3>
          <p>{joe.placeOfBirth}</p>
          <p>{joe.specialty}</p>
        </div>
      ))}
    </div>
  ); 
}

export default App;