import Navbar from "./Navbar";
import {useNavigate} from "react-router-dom";
import {useState,useEffect} from "react";
import "../styles/editprofile.css";



export default function EditProfile() {
  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [bio,setBio] = useState("");
  const [profilePicture,setProfilePicture] = useState(null);

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

    navigate("/profile");
  }

  async function uploadProfilePicture(){

    if (!profilePicture){
      alert("Choose a picture first");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("file", profilePicture);

    const response = await fetch(
      "http://localhost:9000/me/profile-picture",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    if (!response.ok){
      alert("Error uploading picture");
      return;
    }

    alert("Profile picture uploaded");
  }

  return (
    <>
      <Navbar />

      <h1>Edit Profile</h1>

      <div className="edit-profile-section">

        <p>Username</p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="edit-profile-input"
        />

        <p>Bio</p>

        <input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="edit-profile-input"
        />

        <button
          onClick={editProfile}
          className="edit-profile-button"
        >
          Save Profile
        </button>

      </div>

      <div className="edit-profile-section">

        <p>Profile Picture</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
          className="edit-profile-file"
        />

        <button
          onClick={uploadProfilePicture}
          className="edit-profile-button"
        >
          Upload Picture
        </button>

      </div>

      <button
        onClick={() => navigate("/profile")}
        className="edit-profile-cancel"
      >
        Cancel
      </button>

    </>
  );
}
