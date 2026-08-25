import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();

  const wishlists = [
    {
      id: "collection",
      name: "Collection",
      perfume_count: 0,
      isDefault: true,
    },
  ];

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlists</h1>

        <button onClick={() => navigate("/createwishlist")}>
          + Create Wishlist
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlists.map((wishlist) => (
          <div
            key={wishlist.id}
            className="wishlist-card"
            onClick={() => navigate(`/wishlist/${wishlist.id}`)}
          >
            <h2>{wishlist.name}</h2>

            <p>
              {wishlist.perfume_count}{" "}
              {wishlist.perfume_count === 1 ? "perfume" : "perfumes"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;