import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { myContext } from "./Context";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

const NavBar = () => {
  const userObject = useContext(myContext);

  const logout = () => {
    axios
      .get(baseURL + "auth/logout", { withCredentials: true })
      .then((res) => {
        console.log(res);
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
        {userObject.username ? (
          <>
            <li>
              <Link to="/profile">My profile</Link>
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
