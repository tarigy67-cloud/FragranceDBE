import Navbar from "./Navbar"
import { useState, useEffect } from "react"
import { useParams,useNavigate } from "react-router-dom"

export default function SpecificWishlist() {
    const navigate = useNavigate()
    const { wishlistID } = useParams()
    const [wishlist, setWishlist] = useState(null)
    const token = localStorage.getItem("token")

    useEffect(() => {
        async function displayWishlist() {
            const response = await fetch(
                `http://localhost:9000/me/wishlists/${wishlistID}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )


            const data = await response.json()

            setWishlist(data)
        }

        displayWishlist()
    }, [wishlistID, token])



    async function deleteWishlist(){
        const response = await fetch(`http://localhost:9000/me/wishlists/${wishlistID}`,
            {
                method: "DELETE",
                headers:{
                    Authorization: `Bearer ${token}`

                },
            }
        )
        if (!response.ok){
                console.error(response)
        }
        navigate(-1)
    }

    return (
        <>
            <Navbar />
        <button onClick = {() => {navigate(-1)}}> ←</button>
        <button onClick = {deleteWishlist}>Delete Collection</button>
            {wishlist && (
                <>
                    <h1>{wishlist.name}</h1>

                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

                    {wishlist.perfumes.map((perfume) => (

                        <div key={perfume.id} onClick={() => navigate(`/wishlistperfume/${wishlistID}/${perfume.id}`)}>

                            <img  style={{ width: "250px" }} src={perfume.image} alt={perfume.name} />

                            <h2>{perfume.name}</h2>

                            <h3>{perfume.brand}</h3>

                        </div>

                    ))}

                    </div>
                </>
            )}
        </>
    )
}