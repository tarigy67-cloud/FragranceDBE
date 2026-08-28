import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ChangeWishlistName() {
  const navigate = useNavigate();
  const { wishlistID } = useParams();
  const [name, setName] = useState("");

  const changeName = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!name.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:9000/me/wishlists/${wishlistID}?name=${encodeURIComponent(name)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change wishlist name");
      }

      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="change-wishlist-overlay">
      <div className="change-wishlist-modal">

        <button
          onClick={() => navigate(-1)}
          className="change-wishlist-close-button"
        >
          ×
        </button>

        <h2>Change Wishlist Name</h2>

        <form onSubmit={changeName}>
          <input
            type="text"
            placeholder="New wishlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="change-wishlist-input"
          />

          <div className="change-wishlist-buttons">
            <button type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}