import Navbar from "./Navbar";
import {useNavigate} from "react-router-dom";
import {useState,useEffect} from 'react'

export default function Profile() {
  const navigate = useNavigate();
  const [profile,setProfile] = useState(null)

  const [editing,setEditing] = useState(false)
  const [deleting,setDeleting] = useState(false)

  const [username,setUsername] = useState("")
  const [bio,setBio] = useState("")
  const [password,setPassword] = useState("")

  function logout(){
    localStorage.removeItem("token");
    navigate('/login')
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
      setUsername(data.username);
      setBio(data.bio || "");
    }

    profileInformation();

  }, []);

  async function editProfile(){

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:9000/me/account?username=${username}&bio=${bio}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok){
      alert("Error editing profile");
      return;
    }

    setEditing(false);
    window.location.reload();
  }

  async function deleteAccount(){

    if (!window.confirm("Are you sure you want to delete your account?")){
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:9000/me/account?password=${password}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok){
      alert("Wrong password");
      return;
    }

    localStorage.removeItem("token");
    navigate('/login');
  }

  return (
    <>
      <Navbar />

      <h1>Profile</h1>

      <button onClick={logout}>Log Out</button>

      <button onClick={() => setEditing(!editing)}>
        Edit Profile
      </button>

      {editing && (
        <div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          />

          <button onClick={editProfile}>Save</button>
        </div>
      )}

      <div>

        {profile && (
          <>
            <p>Username: {profile.username}</p>
            <p>Profile Picture: {profile.profile_picture}</p>
            <p>Perfumes: {profile.amount_of_perfumes}</p>
            <p>Wishlists: {profile.amount_of_wishlists}</p>
            <p>Bio: {profile.bio}</p>
          </>
        )}

      </div>

      <button onClick={() => setDeleting(!deleting)}>
        Delete Account
      </button>

      {deleting && (
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={deleteAccount}>
            Delete
          </button>
        </div>
      )}

    </>
  );
}