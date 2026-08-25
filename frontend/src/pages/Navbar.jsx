import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import {useState,useEffect} from 'react'



function Navbar() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }},[navigate])

  return (
    <>
      <style>
        {`
          nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 30px;
            border-bottom: 1px solid #ddd;
          }

          nav img {
            width: 50px;
            height: 50px;
            object-fit: contain;
            cursor: pointer;
          }

          .search {
            display: flex;
            align-items: center;
          }

          .search input {
            padding: 10px;
            width: 250px;
            border: 1px solid #ccc;
            border-radius: 6px 0 0 6px;
          }

          .search button {
            padding: 10px 8px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-left: none;
            border-radius: 0 6px 6px 0;
          }

          nav button {
            padding: 10px 15px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 16px;
          }

          nav button:hover {
            text-decoration: underline;
          }

          nav svg {
            cursor: pointer;
          }
        `}
      </style>

      <nav>
        <img
          onClick={() => navigate('/home')}
          src="/logo.png"
          alt="Logo"
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

        <button onClick={() => navigate('/collection')}>
          Collection
        </button>

        <button onClick={() => navigate('/wishlist')}>
          Wishlists
        </button>

        <User onClick={() => navigate('/profile')} />
      </nav>
    </>
  )
}

export default Navbar