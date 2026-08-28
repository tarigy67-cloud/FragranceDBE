import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

const ACCORD_COLORS = {
  woody: { bg: "#774414", text: "#FFFFFF" },
  powdery: { bg: "#EEDDCC", text: "#000000" },
  sweet: { bg: "#EE363B", text: "#FFFFFF" },
  citrus: { bg: "#F9FF52", text: "#000000" },
  aromatic: { bg: "#37A089", text: "#000000" },
  "fresh spicy": { bg: "#83C928", text: "#000000" },
  amber: { bg: "#BC4D10", text: "#FFFFFF" },
  "warm spicy": { bg: "#CC3300", text: "#FFFFFF" },
  floral: { bg: "#FF5F8D", text: "#000000" },
  musky: { bg: "#E7D8EA", text: "#000000" },
  green: { bg: "#0E8C1D", text: "#FFFFFF" },
  fresh: { bg: "#9BE5ED", text: "#000000" },
  fruity: { bg: "#FF6F61", text: "#FFFFFF" },
  herbal: { bg: "#6B8E23", text: "#FFFFFF" },
  earthy: { bg: "#6F4E37", text: "#FFFFFF" },
  patchouli: { bg: "#5C4033", text: "#FFFFFF" },
  lavender: { bg: "#B497D6", text: "#000000" },
  vanilla: { bg: "#F3E5AB", text: "#000000" },
  "soft spicy": { bg: "#E2925A", text: "#000000" },
  warm: { bg: "#D17842", text: "#FFFFFF" },
  balsamic: { bg: "#7A4A2B", text: "#FFFFFF" },
  leather: { bg: "#5A3825", text: "#FFFFFF" },
  smoky: { bg: "#4A4A4A", text: "#FFFFFF" },
  tobacco: { bg: "#7B5A3A", text: "#FFFFFF" },
  marine: { bg: "#2E86AB", text: "#FFFFFF" },
  aquatic: { bg: "#5BC8D4", text: "#000000" },
  ozonic: { bg: "#A8DADC", text: "#000000" },
  animalic: { bg: "#8B6F47", text: "#FFFFFF" },
  "white floral": { bg: "#FFF5F7", text: "#000000" },
  mossy: { bg: "#5A6B3F", text: "#FFFFFF" },
  rose: { bg: "#E8748A", text: "#FFFFFF" },
  tropical: { bg: "#FFAE42", text: "#000000" },
  coconut: { bg: "#FFF3D6", text: "#000000" },
  almond: { bg: "#EFDECD", text: "#000000" },
  caramel: { bg: "#C68E17", text: "#FFFFFF" },
  honey: { bg: "#FFC30B", text: "#000000" },
  cinnamon: { bg: "#B5502E", text: "#FFFFFF" },
  nutty: { bg: "#8C6239", text: "#FFFFFF" },
};

function getAccordColor(name) {
  const key = name?.toLowerCase();
  return ACCORD_COLORS[key] || { bg: "#e0e0e0", text: "#333333" };
}

function WishlistPerfume() {
  const { wishlistID,perfumeId } = useParams();
  const navigate = useNavigate();
  const [perfume, setPerfume] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9000/perfumes/${perfumeId}?perfumeID=${perfumeId}`)
      .then((response) => response.json())
      .then((data) => setPerfume(data));
  }, [perfumeId]);

  if (!perfume) {
    return (
      <>
        <h1 className="loading">Loading...</h1>
      </>
    );
  }



  async function deleteFromWishlist(){
    const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:9000/me/wishlists/${wishlistID}/${perfumeId}`,
    {
     method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    console.error(await response.json());
    return;
  }

  navigate(-1);
  }



  async function addToCollection() {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `http://localhost:9000/me/collection/${perfume.id}`,

        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        const error = await response.json();
        alert(error.detail);
        return;
    }
    alert("Added to collection!");
    navigate(-1)
}

  
  return (
    <>

      <Navbar />

      <div className="perfume-page">
      <button onClick = {() => {navigate(-1)}}> ←</button>

        <div className="perfume-container">
          <div className="perfume-image-container">
            <img
              src={perfume.image}
              alt={perfume.name}
              className="perfume-image"
            />
          </div>

          <div className="perfume-details">
            <p className="perfume-brand">{perfume.brand}</p>

            <h1 className="perfume-name">{perfume.name}</h1>

            <p className="perfume-info">
              {perfume.gender}
              {perfume.concentration && (
                <>
                  <span> • </span>
                  {perfume.concentration}
                </>
              )}
            </p>

            <div className="button-container">
              <button onClick = {addToCollection}className="collection-button">
                + Add to Collection
              </button>

              <button
                className="wishlist-button"
                onClick={() => navigate(`/addtowishlist/${perfume.id}`)}
              >
                ♡ Add to Wishlist
              </button>

              <button
                className="delete-wishlist-button"
                onClick={() => deleteFromWishlist()}
              >
                Remove from wishlist
              </button>

              
            </div>

            <div className="section">
              <h3 className="section-heading">Description</h3>

              <p className="description">
                {perfume.description || "No description available."}
              </p>
            </div>

            <div className="section">
              <h3 className="section-heading">Release Year</h3>
              <p>{perfume.release_year}</p>
            </div>

            <div className="section">
              <h3 className="section-heading">Accords</h3>

              {perfume.accords?.map((accord, index) => {
                const color = getAccordColor(accord.name);

                return (
                  <span
                    key={index}
                    className="accord"
                    style={{
                      "--accord-bg": color.bg,
                      "--accord-text": color.text,
                    }}
                  >
                    {accord.name}
                  </span>
                );
              })}
            </div>

            <div className="section">
              <h3 className="section-heading">Notes Pyramid</h3>

              <h4 className="note-heading">Top Notes</h4>

              {perfume.top_notes?.map((note, index) => (
                <span key={index} className="note">
                  {note.name}
                </span>
              ))}

              <h4 className="middle-heading">Middle Notes</h4>

              {perfume.middle_notes?.map((note, index) => (
                <span key={index} className="note">
                  {note.name}
                </span>
              ))}

              <h4 className="base-heading">Base Notes</h4>

              {perfume.bottom_notes?.map((note, index) => (
                <span key={index} className="note">
                  {note.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WishlistPerfume;