import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/wishlist.css";

export default function CreateWishlist() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const createWishlist = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token")

    if (!name.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:9000/me/wishlists?name=${encodeURIComponent(name)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }



        }
      );

      if (!response.ok) {
        throw new Error("Failed to create wishlist");
      }

      navigate("/wishlist");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wishlist-overlay">
      <div className="wishlist-modal">
        {/* X button */}
        <button
          onClick={() => navigate("/wishlist")}
          className="wishlist-close-button"
        >
          ×
        </button>

        <h2>Create Wishlist</h2>

        <form onSubmit={createWishlist}>
          <input
            type="text"
            placeholder="Wishlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="wishlist-input"
          />

          <div className="wishlist-submit-container">
            <button type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}