import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [search, setSearch] = useState("");
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
  .then(() => {      
      return fetch("http://localhost:5116/api/joes?pageSize=100");
    })

    .then(res => res.json())
    .then(data => {
      setJoes(data.data);
      setName("");
      setPlaceOfBirth("");
      setSpecialty("");
    })
    .catch(err => console.error(err));
};  

    const handleDelete = (id) => {
     fetch(`http://localhost:5116/api/joes/${id}`, {
     method: "DELETE"
  })
    .then(() => {
      setJoes(prev => prev.filter(joe => joe.id !== id));
    })
    .catch(err => console.error(err));
};
    const handleSearch = () => {
  fetch(`http://localhost:5116/api/joes/by-name/${search}`)
    .then(res => {
      if (!res.ok) throw new Error("Not found");
      return res.json();
    })
    .then(data => {
      setJoes([data]); 
    })
    .catch(() => {
      setJoes([]); // clear if Joe is not found
    });
};

  return (
    <div>
      <h1>GI Joe Characters</h1>

    <div>
      <input
       type="text"
       placeholder="Search by name..."
       value={search}
       onChange={(e) => setSearch(e.target.value)}
      />
 
    <button onClick={handleSearch}>
      Search
    </button>

    <button onClick={() => {
    fetch("http://localhost:5116/api/joes?pageSize=100")
      .then(res => res.json())
      .then(data => setJoes(data.data));
    }}>
    Reset
    </button>
   </div>

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

    {Array.isArray(joes) && joes.length > 0 ? (
      joes.map((joe) => (
        <div key={joe.id} className="card">
        <h3>{joe.name}</h3>
        <p>{joe.placeOfBirth}</p>
        <p>{joe.specialty}</p>

      <button onClick={() => handleDelete(joe.id)}>
        Delete
      </button>
    </div>
  ))
) : (
  <p>No characters found</p>
)}
    </div>
  ); 
}

export default App;