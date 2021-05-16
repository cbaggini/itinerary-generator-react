import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

export const myContext = createContext({});
export default function Context(props) {
  const [userObject, setUserObject] = useState({});

  useEffect(() => {
    axios.get(baseURL + "getuser", { withCredentials: true }).then((res) => {
      console.log(res);
      if (res.data) {
        setUserObject(res.data);
      }
    });
  }, []);
  return (
    <myContext.Provider value={userObject}>{props.children}</myContext.Provider>
  );
}
