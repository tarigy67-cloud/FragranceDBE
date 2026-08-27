import { useNavigate, useParams} from "react-router-dom";
import {useState ,useEffect} from 'react'

export default function AddToWishlist() {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState([])
  const token = localStorage.getItem("token")
  const {perfumeID} = useParams()

  
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



  async function handleClick(wishlistID){
    const perfume_id = perfumeID
    const response = await fetch(`http://localhost:9000/me/wishlists/${wishlistID}/${perfume_id}`,
        {
            method: "POST",
            headers:{
                Authorization: `Bearer ${token}`
            }

        }

    )
    if (!response.ok){
        console.error(response)
    }

        navigate(-1)

    

  }
    
  return (
    <>
      <style>{`
        .wishlist-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wishlist-modal {
          position: relative;
          background: white;
          width: 400px;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          border: none;
          background: none;
          font-size: 24px;
          cursor: pointer;
        }

        .wishlist-title {
          margin-top: 0;
          margin-bottom: 10px;
        }

        .wishlist-text {
          color: #666;
          margin-bottom: 25px;
        }

        .wishlist-option {
          width: 100%;
          padding: 15px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          text-align: left;
          cursor: pointer;
          font-size: 16px;
        }

        .wishlist-option:hover {
          background: #f5f5f5;
        }
      `}</style>

      <div className="wishlist-overlay">
        <div className="wishlist-modal">
          <button
            className="close-button"
            onClick={() => navigate(-1)}
          >
            ×
          </button>

          <h2 className="wishlist-title">Add to Wishlist</h2>

          <p className="wishlist-text">
            Select a wishlist to add this perfume to.
          </p>

          {wishlists.map((wishlist) => (
            <button
            onClick = {() => {handleClick(wishlist.id)}}
              key={wishlist.id}
              className="wishlist-option"
            >
              {wishlist.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}