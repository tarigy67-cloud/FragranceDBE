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