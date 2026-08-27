import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          maxWidth: "90%",
        }}
      >
        {/* X button */}
        <button
          onClick={() => navigate("/wishlist")}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            border: "none",
            background: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
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
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}