import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  function logout(){
    localStorage.removeItem("token");
    navigate('/login')
  }

  return (
    <>
      <Navbar />

      <h1>Profile</h1>

      <button onClick={logout}>
        Log Out
      </button>
    </>
  );
}