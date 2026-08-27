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
      <style>{`
        .wishlist-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .wishlist-header h1 {
          margin: 0;
        }

        .create-button {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          background-color: #222;
          color: white;
          cursor: pointer;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .wishlist-card {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background-color: #fff;
          cursor: pointer;
        }

        .wishlist-card h3 {
          margin: 0 0 8px 0;
        }

        .wishlist-card p {
          margin: 0;
          color: #666;
        }
      `}</style>

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