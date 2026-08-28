import Navbar from "./Navbar"
import {useState,useEffect} from 'react'
import {useParams,useNavigate} from 'react-router-dom'

export default function Search(){

  const {search} = useParams()
  const [error,setError] = useState("")
  const [perfume,setPerfume] = useState("")
  const navigate = useNavigate()


  useEffect(() =>{

    async function getPerfume(){
        try{            
            const response = await fetch(`http://localhost:9000/perfumes/search?q=${encodeURIComponent(search)}`)

            if (!response.ok){throw new Error("Perfume Not Found")}
            const data = await(response.json())
            setPerfume(data)


          
        }
        catch(error){
            setError(error)
        }
    }


    getPerfume()
  },[search])



  return(<>

    <Navbar/>
    
    <div className="search-page">

      <h2>Perfumes </h2>

      <div
        className="search-perfume"
        onClick = {() => navigate(`/perfume/${perfume.id}`)}
      >
        <img
          className="search-perfume-image"
          src={perfume.image}
          alt={perfume.name}
        />

        <br/>

        <p className="search-perfume-name">{perfume.name}</p>
      </div>


    </div>

  </>)

}