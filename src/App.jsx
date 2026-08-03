import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [joes, setJoes] = useState([]);
  const [name, setName] = useState("");
  const [accessories, setAccessories] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [faction, setFaction] = useState("");
  const [hasFileCard, setHasFileCard] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAccessories, setEditAccessories] = useState("");
  const [editSpecialty, setEditSpecialty] = useState("");  
  const [editFaction, setEditFaction] = useState("");
  const [editHasFileCard, setEditHasFileCard] = useState(false);

 useEffect(() => {
  fetch("http://localhost:5116/api/joes")
    .then(res => res.json())
    .then(data => {
      console.log("API DATA:", data);
      setJoes(data.data)
     })
    .catch(err => console.error("API error:", err));
}, []);

const handleSubmit = (e) => {
  e.preventDefault();

  const newJoe = {
    name,
    accessories,
    specialty,
    faction,
    hasFileCard
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
      setAccessories("");
      setSpecialty("");
      setFaction("");
      setHasFileCard(false);
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
  fetch(`http://localhost:5116/api/joes/search?name=${search}`)
    .then(res => {
      if (!res.ok) throw new Error("Not found");
      return res.json();
    })
    .then(data => {
      setJoes(data); 
    })
    .catch(() => {
      setJoes([]); 
    });
};
    const handleEdit = (joe) => {
      setEditingId(joe.id);
      setEditName(joe.name);
      setEditAccessories(joe.accessories);
      setEditSpecialty(joe.specialty);
      setEditFaction(joe.faction);
      setEditHasFileCard(joe.hasFileCard);
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
    placeholder="Accessories"
    value={accessories}
    onChange={(e) => setAccessories(e.target.value)}
  />

  <input
    type="text"
    placeholder="Specialty"
    value={specialty}
    onChange={(e) => setSpecialty(e.target.value)}
  />
  <input
    type="text"
    placeholder="Faction"
    value={faction}
    onChange={(e) => setFaction(e.target.value)}
  />
  <label>
  File Card:
  <input
    type="checkbox"
    checked={hasFileCard}
    onChange={(e) => setHasFileCard(e.target.checked)}
  />
  </label>

  <button type="submit">Add Joe</button>
</form>

    {Array.isArray(joes) && joes.length > 0 ? (
      joes.map((joe) => (
        <div key={joe.id} 
        className={
           joe.faction?.toLowerCase() === "cobra"
          ? "cobra-card"
          : "joe-card"
        } 
       >  
       {editingId === joe.id ? (
<>
<h3>Editing Character</h3>

<input 
value={editName}
onChange={(e) => setEditName(e.target.value)}
/>
<input 
value={editAccessories}
onChange={(e) => setEditAccessories(e.target.value)}
/>
<input 
value={editSpecialty}
onChange={(e) => setEditSpecialty(e.target.value)}
/>
<input 
value={editFaction}
onChange={(e) => setEditFaction(e.target.value)}
/>

<button onClick={() => {
  fetch(`http://localhost:5116/api/joes/${editingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: editName,
      accessories: editAccessories,
      specialty: editSpecialty,
      faction: editFaction,
      hasFileCard: editHasFileCard
    })
  })
    .then(() => {
      setEditingId(null);
        // refreshes the list of Jooes after editing them
      fetch("http://localhost:5116/api/joes?pageSize=100")
        .then(res => res.json())
        .then(data => setJoes(data.data));
    })
    .catch(err => console.error(err));
}}>
  Save
</button>

<button onClick={() => setEditingId(null)}>
    Cancel
</button>
</>       

    ) : (
        <>

<h2>
{joe.faction?.toLowerCase() === "cobra"
  ? "COBRA ENEMY!"
  : "GI JOE"}
</h2>

<h2>
{joe.faction?.toLowerCase() === "cobra"
  ? "ENEMY INTELLIGENCE FILE"
  : "COMMAND FILE DOSSIER"}
</h2>

<h3>{joe.name}</h3>

<h4>SPECIALTY</h4>
<p>{joe.specialty}</p>

<h4>ACCESSORIES</h4>
<p>{joe.accessories}</p>

<h4>FACTION</h4>
<p>{joe.faction}</p>    

<h4>FILE CARD</h4>
<p>{joe.hasFileCard ? "YES" : "NO"}</p>

<button onClick={() => handleDelete(joe.id)}>
    Delete
</button>

<button onClick={() => handleEdit(joe)}>
    Edit
</button>
</>
    )}
</div>  
  ))
) : (
  <p>No characters found</p> 
)} 
    </div>
  ); 
}

export default App;