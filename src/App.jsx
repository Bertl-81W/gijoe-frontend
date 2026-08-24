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
  const [imageFile, setImageFile] = useState(null);   
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAccessories, setEditAccessories] = useState("");
  const [editSpecialty, setEditSpecialty] = useState("");  
  const [editFaction, setEditFaction] = useState("");
  const [editHasFileCard, setEditHasFileCard] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
   
 useEffect(() => {
  fetch("http://localhost:5116/api/joes")
    .then(res => res.json())
    .then(data => {
      console.log("API DATA:", data);
      setJoes(data.data)
     })
    .catch(err => console.error("API error:", err));
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  const newJoe = {
    name,
    accessories,
    specialty,
    faction,
    hasFileCard
  };

  try {
                                //  Create the character
    const response = await fetch("http://localhost:5116/api/joes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newJoe)
    });

    if (!response.ok) {
      throw new Error("Failed to create character");
    }

    const createdJoe = await response.json();

                           // Upload the photo if one was selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const imageResponse = await fetch(
        `http://localhost:5116/api/joes/${createdJoe.id}/image`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!imageResponse.ok) {
        throw new Error("Character created, but image upload failed");
      }
    }

                        // Refresh the character list
    const listResponse = await fetch(
      "http://localhost:5116/api/joes?pageSize=100"
    );

    const data = await listResponse.json();

    setJoes(data.data);

                            // ANd Clear the form
    setName("");
    setAccessories("");
    setSpecialty("");
    setFaction("");
    setHasFileCard(false);
    setImageFile(null);
    setEditingId(null);

  } catch (err) {
    console.error(err);
  }
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
      setEditImageFile(null);
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

<form className="character-form"onSubmit={handleSubmit}>
  <input
    id="name"
    name="name"
    type="text"
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    type="text"
    id="accessories"
    name="accessories"
    placeholder="Accessories"
    value={accessories}
    onChange={(e) => setAccessories(e.target.value)}
  />

  <input
    type="text"
    id="specialty"
    name="specialty"
    placeholder="Specialty"
    value={specialty}
    onChange={(e) => setSpecialty(e.target.value)}
  />
  <label htmlFor="faction">Faction</label>
    <select
      id="faction"
      name="faction"
      value={faction}
      onChange={(e) => setFaction(e.target.value)}
    >
    <option value="">Select faction</option>
    <option value="GI Joe">GI Joe</option>
    <option value="Cobra">Cobra</option>
    </select>

 <div className="collector-status">
  <span className="collector-status-title">COLLECTOR STATUS</span>

  <label htmlFor="has-file-card" className="checkbox-label">
    <input
      id="has-file-card"
      name="hasFileCard"
      type="checkbox"
      checked={hasFileCard}
      onChange={(e) => setHasFileCard(e.target.checked)}
    />
    <span>I HAVE THE FILE CARD</span>
  </label>  
</div>

<div className="photo-upload">
  <label htmlFor="image-file">Figure Photo</label>

  <input
    id="image-file"
    name="image"
    type="file"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files[0])}
  />
</div>

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
      {joe.imageUrl && (
        <img
        src={`http://localhost:5116${joe.imageUrl}`}
        alt={joe.name}
        className="character-image"
        />
      )}

       {editingId === joe.id ? (
         <><div className="edit-form">
           
              <h3>Editing Character</h3>

             <label>
                Name
                <input
                  id="edit-name"
                  name="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)} />
                </label>

                <label>
                  Accessories
                  <input
                    type="text"
                    id="edit-accessories"
                    name="edit-accessories"
                    value={editAccessories}
                    onChange={(e) => setEditAccessories(e.target.value)} />
                </label>

                <label>
                  Specialty
                  <input
                    type="text"
                    id="edit-specialty"
                    name="edit-specialty"
                    value={editSpecialty}
                    onChange={(e) => setEditSpecialty(e.target.value)} />
                </label>

                <label htmlFor="edit-faction">Faction</label>
                <select
                  id="edit-faction"
                  name="faction"
                  value={editFaction}
                  onChange={(e) => setEditFaction(e.target.value)}
                >
                  <option value="">Select faction</option>
                  <option value="GI Joe">GI Joe</option>
                  <option value="Cobra">Cobra</option>
                </select>

               <label htmlFor="edit-image-file">Figure Photo</label>
                <input
                  id="edit-image-file"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                />
              <div className="collector-status">
                <span className="collector-status-title">COLLECTOR STATUS</span>

               <label htmlFor="edit-file-card" className="checkbox-label">
                 <input
                   id="edit-file-card"
                   name="hasFileCard"
                   type="checkbox"
                   checked={editHasFileCard}
                   onChange={(e) => setEditHasFileCard(e.target.checked)}
               />
                <span>I HAVE THE FILE CARD</span>
              </label>
            </div>

                <button
                  onClick={async () => {
                    try {
                      // Update character information
                      const response = await fetch(
                        `http://localhost:5116/api/joes/${editingId}`,
                        {
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
                        }
                      );

                      if (!response.ok) {
                        throw new Error("Failed to update character");
                      }

                      // Upload new photo if one was selected
                      if (editImageFile) {
                        const formData = new FormData();
                        formData.append("image", editImageFile);

                        const imageResponse = await fetch(
                          `http://localhost:5116/api/joes/${editingId}/image`,
                          {
                            method: "POST",
                            body: formData
                          }
                        );

                        if (!imageResponse.ok) {
                          throw new Error("Character updated, but image upload failed");
                        }
                      }

                      // Refreshes characters
                      const listResponse = await fetch(
                        "http://localhost:5116/api/joes?pageSize=100"
                      );

                      const data = await listResponse.json();

                      setJoes(data.data);

                      // Exit edit mode
                      setEditingId(null);
                      setEditImageFile(null);

                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  Save
                </button>

                <button onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div></>  
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

<div className="card-collector-status">
  <h4>COLLECTOR STATUS</h4>

  <p className={joe.hasFileCard ? "has-file-card" : "missing-file-card"}>
    {joe.hasFileCard
      ? "✓ FILE CARD"
      : "✗ FILE CARD MISSING"}
  </p>
</div>

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