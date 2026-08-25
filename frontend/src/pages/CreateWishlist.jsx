import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateWishlist() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createWishlist = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter a wishlist name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/me/wishlists?name=${encodeURIComponent(name.trim())}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create wishlist");
      }

      navigate("/wishlist");
    } catch (error) {
      console.error(error);
      setError("Could not create wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Wishlist</h1>

      <form onSubmit={createWishlist}>
        <label htmlFor="wishlist-name">Wishlist name</label>

        <input
          id="wishlist-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Summer Scents"
        />

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Wishlist"}
        </button>
      </form>

      <button onClick={() => navigate("/wishlist")}>
        Cancel
      </button>
    </div>
  );
}