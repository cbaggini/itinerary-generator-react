import "./App.css";
import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Main from "./Main";
import Footer from "./Footer";
import NavBar from "./NavBar";
import Login from "./Login";
import Latest from "./Latest";
import Profile from "./Profile";
import { myContext } from "./Context";

function App() {
  const userObject = useContext(myContext);
  console.log(userObject);
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/latest">
            <Latest />
            <Route path="/profile">
              <Profile />
            </Route>
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
