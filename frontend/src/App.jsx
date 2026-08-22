import {Routes,Route,Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Search from './pages/Search'
import Perfume from './pages/Perfume'
import Collection from './pages/Collection'
import Wishlist from './pages/Wishlist'
import WishlistDetails from './pages/WishlistDetails'
import AddedPerfume from './pages/AddedPerfume.jsx'


export default function App(){
  
return(<>
<Routes>
<Route path = '/home' element = {<Home/>}/>
<Route path = '/register' element = {<Register/>}/>
<Route path = '/login' element = {<Login/>}/>
<Route path = '/search' element = {<Search/>}/>
<Route path = '/perfume/:perfumeId' element = {<Perfume/>}/>
<Route path = '/collection' element = {<Collection/>}/>
<Route path = '/wishlist' element = {<Wishlist/>}/>
<Route path = '/wishlistdetails' element = {<WishlistDetails/>}/>
<Route path = '/addedPerfume' element = {<AddedPerfume/>}/>
</Routes>
</>)}


