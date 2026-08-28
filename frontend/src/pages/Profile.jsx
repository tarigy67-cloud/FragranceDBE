import Navbar from "./Navbar";
import {useNavigate} from "react-router-dom";
import {useState,useEffect} from "react";
import "../styles/profile.css";


export default function Profile() {
  const navigate = useNavigate();
  const [profile,setProfile] = useState(null);

  function logout(){
    localStorage.removeItem("token");
    navigate('/login');
  }

  useEffect(() => {

    async function profileInformation() {

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:9000/me/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      const data = await response.json();

      setProfile(data);
    }

    profileInformation();

  }, []);

  return (
    <>
     
     <Navbar />

<div className="profile-page">

  <div className="profile-information">

    {profile && (
      <>
        {profile.profile_picture ? (
          <img
            className="profile-picture"
            src={`http://localhost:9000${profile.profile_picture}`}
            alt="Profile"
          />
        ) : (
          <div className="profile-picture"></div>
        )}

        <h1>{profile.username}</h1>

        <p className="profile-bio">
          {profile.bio || "No bio yet."}
        </p>

        <p className="profile-perfumes">
          {profile.amount_of_perfumes} perfumes owned
        </p>
      </>
    )}

  </div>

  <div className="profile-actions">

    <button
      className="profile-button"
      onClick={() => navigate("/edit-profile")}
    >
      Edit Profile
    </button>

    <button
      className="profile-button"
      onClick={logout}
    >
      Log Out
    </button>

  </div>

</div>


    </>
  );
}

