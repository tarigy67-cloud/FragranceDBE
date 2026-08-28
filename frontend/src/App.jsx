import {Routes,Route,Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Search from './pages/Search'
import Perfume from './pages/Perfume'
import Collection from './pages/Collection'
import Wishlist from './pages/Wishlist'
import CreateWishlist from './pages/CreateWishlist.jsx'
import Profile from './pages/Profile.jsx'
import SpecificWishlist from './pages/SpecificWishlist.jsx'
import AddToWishlist from './pages/AddToWishlist.jsx'
import WishlistPerfume from './pages/WishlistPerfume.jsx'
import ChangeWishlistName from './pages/changeWishlistName.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import CollectionPerfume from './pages/CollectionPerfume.jsx'
import EditProfile from './pages/EditProfile.jsx'


export default function App(){
  
return(<>
<Routes>
<Route path = '/home' element = {<Home/>}/>
<Route path = '/register' element = {<Register/>}/>
<Route path = '/login' element = {<Login/>}/>
<Route path = '/search/:search' element = {<Search/>}/>
<Route path = '/perfume/:perfumeId' element = {<Perfume/>}/>
<Route path = '/wishlistperfume/:wishlistID/:perfumeId' element = {<WishlistPerfume/>}/>
<Route path = '/collection' element = {<Collection/>}/>
<Route path = '/wishlist' element = {<Wishlist/>}/>
<Route path = '/createwishlist' element = {<CreateWishlist/>}/>
<Route path = '/profile' element = {<Profile/>}/>
<Route path = '/specificwishlist/:wishlistID' element = {<SpecificWishlist/>}/>
<Route path = '/addtowishlist/:perfumeID' element = {<AddToWishlist/>}/>
<Route path = '/changewishlistname/:wishlistID' element = {<ChangeWishlistName/>}/>
<Route path="/verify-email" element={<VerifyEmail />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/collectionperfume/:perfumeId" element={<CollectionPerfume />} />
<Route path="/edit-profile" element={<EditProfile />} />



</Routes>
</>)}


