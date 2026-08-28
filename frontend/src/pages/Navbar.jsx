import { useNavigate } from 'react-router-dom'
import { User, House } from 'lucide-react'
import {useState,useEffect} from 'react'
import "../styles/navbar.css"



function Navbar() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }},[])

  return (
    <>
      <nav>
        <House
          onClick={() => navigate('/home')}
         
        />

        <div className="search">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />

          <button onClick={() => navigate(`/search/${search}`)}>
            Search
          </button>
        </div>

       

        <button onClick={() => navigate('/wishlist')}>
          Wishlists
        </button>

        <User onClick={() => navigate('/profile')} />
      </nav>
    </>
  )
}

export default Navbar