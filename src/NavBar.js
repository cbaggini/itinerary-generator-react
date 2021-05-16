import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { myContext } from "./Context";

const NavBar = () => {
  const userObject = useContext(myContext);

  const logout = () => {
    fetch("https://o-auth-video-backend.herokuapp.com/auth/logout", {
      credentials: "include",
    }).then((res) => {
      if (res.data === "done") {
        window.location.href = "/";
      }
    });
  };

  return (
    <nav className="navBarWrapper">
      <ul className="navBar">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/latest">Latest trips saved</Link>
        </li>
        {userObject ? (
          <>
            <li>
              <Link to="/profile">Latest saved trips</Link>
            </li>
            <li onClick={logout}>Logout </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
