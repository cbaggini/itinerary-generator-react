import React from "react";
import googleImage from "./assets/googleImage.jpeg";
import githubImage from "./assets/githubImage.png";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

const Login = () => {
  const googleLogin = () => {
    window.open(baseURL + "auth/google", "_self");
  };

  const githubLogin = () => {
    window.open(baseURL + "auth/github", "_self");
  };
  return (
    <div className="loginPage">
      <div className="loginForm">
        <h1>Login</h1>
        <div className="googleContainer" onClick={googleLogin}>
          <img src={googleImage} alt="Google Icon" />
          <p>Login With Google</p>
        </div>

        <div className="googleContainer githubContainer" onClick={githubLogin}>
          <img src={githubImage} alt="Github Icon" />
          <p>Login With Github</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
