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
          <Route exact path="/" component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/latest" component={Latest} />
          <Route path="/profile" component={Profile} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
