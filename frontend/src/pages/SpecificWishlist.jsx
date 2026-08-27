import Navbar from "./Navbar"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

export default function SpecificWishlist() {
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

    return (
        <>
            <Navbar />

            {wishlist && (
                <>
                    <h1>{wishlist.name}</h1>
                    <p>{wishlist.id}</p>
                </>
            )}
        </>
    )
}