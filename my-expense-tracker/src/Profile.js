import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    setError("");
    setSuccess(false);
    if (!name || !photoURL) {
      setError("All fields are required!");
      return;
    }

    try {
      const auth = getAuth();
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      setSuccess(true);
      setTimeout(() => navigate("/welcome"), 2000);
    } catch (err) {
      setError("Failed to update profile. Try again!");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
     
      <div className="position-absolute top-0 end-0 m-3 p-2 bg-light border rounded">
        <p>Your Profile is <strong>64%</strong> completed. A complete profile has higher chances of landing a job. <a href="#">Complete now</a></p>
      </div>

     
      <h2 className="mb-4">Contact Details</h2>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">Profile updated successfully!</p>}
      
      <div className="d-flex gap-3">
       
        <div>
          <label className="me-2">🔗 Full Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        
        <div>
          <label className="me-2">🌍 Profile Photo URL:</label>
          <input
            type="text"
            className="form-control"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
        </div>
      </div>

      
      <div className="d-flex mt-3">
        <button className="btn btn-danger me-2" onClick={handleUpdate}>Update</button>
        <button className="btn btn-secondary" onClick={() => navigate("/welcome")}>Cancel</button>
      </div>
    </div>
  );
};

export default Profile;
