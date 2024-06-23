import { Link } from 'react-router-dom'
import { auth } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState } from "react"

export const Navbar = () => {
  const [user] = useAuthState(auth);
  const [profileDrop, setProfileDrop] = useState(false);
  const setDropdown = () => {
    setProfileDrop(!profileDrop);
  }
  const signOutUser = async() => {
    await auth.signOut();
  }

  return (
    <>
      <nav className="navbar">
        <h3 className="logo">SocialPedia
          <i className="bi bi-chat-heart-fill"></i>
        </h3>
        <Link to={"/"}>Home</Link>
        {!user ? 
          <Link to={"/login"}>Login</Link> :
          <Link to={"/create-post"}>Create Post</Link>
        }
        {user && (
          <>
            <div className="profile" onClick={setDropdown}>
              <div id="profile-btn">
                <span className="profile-name">
                  {user?.displayName}
                </span>
                <img src={user?.photoURL || "https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg"} className="fake-img"/>
                <i className="bi bi-chevron-down"></i>
              </div>
              <div id="profile-dd" style={{ display: profileDrop ? "flex" : "none" }}>
                <div className="profile-actions">
                  <a href="#">Profile</a>
                  <button onClick={signOutUser}>Logout</button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  )
}