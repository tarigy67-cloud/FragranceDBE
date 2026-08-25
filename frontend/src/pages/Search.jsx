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
    



    <h1>{search} </h1>
    <div onClick = {() => navigate(`/perfume/${perfume.id}`)}>
    <img src={perfume.image} alt={perfume.name} />
    <br/>
    <p>{perfume.name}</p>
    </div>

  </>)

}




