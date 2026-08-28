import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Wishlist = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    async function getWishlists() {
      const response = await fetch("http://localhost:9000/me/wishlists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setWishlists(data);
    }

    getWishlists();
  }, [token]);

  return (
    <>
      <Navbar />

      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Wishlists</h1>

          <button
            className="create-button"
            onClick={() => navigate("/createwishlist")}
          >
            + Create Wishlist
          </button>
        </div>

        <div className="wishlist-grid">
          {wishlists.map((wishlist) => (
            <div className="wishlist-card" key={wishlist.id}
            onClick={() => navigate(`/specificwishlist/${wishlist.id}`)}            >
              <h3>{wishlist.name}</h3>

              <p>
                {wishlist.perfume_count}{" "}
                {wishlist.perfume_count === 1 ? "perfume" : "perfumes"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;