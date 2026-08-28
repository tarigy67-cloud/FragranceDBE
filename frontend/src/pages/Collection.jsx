import Navbar from "./Navbar"
import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import "../styles/collection.css"

export default function Collection(){

    const navigate = useNavigate()
    const [collection, setCollection] = useState([])
    const token = localStorage.getItem("token")

    useEffect(() => {
        async function getCollection(){

            const response = await fetch(
                "http://localhost:9000/me/collection",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok){
                console.error(response)
                return
            }

            const data = await response.json()
            console.log(data)
            setCollection(data)
        }

        getCollection()
    }, [])

    return(
        <>

            <h1>User Collection</h1>

            <div className="collection-container">

                {collection.map((perfume) => (

                    <div
                        key={perfume.id}
                        onClick={() => navigate(`/collectionperfume/${perfume.id}`)}
                        className="collection-perfume"

                        
                    >

                        <img
                            src={perfume.image}
                            alt={perfume.name}
                            className="collection-perfume-image"
                        />

                        <h2>{perfume.name}</h2>
                        <h3>{perfume.brand}</h3>

                    </div>

                ))}

            </div>
        </>
    )
}
