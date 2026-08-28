import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/editprofile.css";

export default function EditProfile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentPicture, setCurrentPicture] = useState("");

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
      setCurrentPicture(data.profile_picture || "");
    }

    profileInformation();
  }, []);

  async function editProfile() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:9000/me/account?username=${encodeURIComponent(username)}&bio=${encodeURIComponent(bio)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      alert("Error editing profile");
      return;
    }

    navigate("/profile");
  }

  async function uploadProfilePicture() {
    if (!profilePicture) {
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

    if (!response.ok) {
      alert("Error uploading picture");
      return;
    }

    alert("Profile picture uploaded");
  }

  return (
    <>
      <Navbar />

      <div className="edit-profile">
        <div className="edit-profile-box">

          <h1>Edit Profile</h1>

          <p className="edit-profile-subtitle">
            Update your profile information
          </p>

          <p>Username</p>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <p>Bio</p>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people a little about yourself..."
          />

          <div className="profile-picture-section">

            {currentPicture ? (
              <img
                className="profile-picture-preview"
                src={`http://localhost:9000${currentPicture}`}
                alt="Profile"
              />
            ) : (
              <div className="profile-picture-preview"></div>
            )}

            <p>Profile Picture</p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfilePicture(e.target.files[0])
              }
            />

            <button onClick={uploadProfilePicture}>
              Upload Picture
            </button>

          </div>

          <div className="edit-profile-buttons">

            <button onClick={editProfile}>
              Save Changes
            </button>

            <button
              className="cancel-button"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>

          </div>

        </div>
      </div>
    </>
  );
}