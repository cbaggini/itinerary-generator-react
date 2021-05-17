import React, { useState, useEffect, useContext } from "react";
import { myContext } from "./Context";
import TableHead from "./TableHead";
import SavedTrip from "./SavedTrip";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

const Profile = () => {
  const userObject = useContext(myContext);
  const [myTrips, setMyTrips] = useState([]);

  useEffect(() => {
    if (userObject._id) {
      fetch(baseURL + "trips/" + userObject._id)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Could not load your trips");
          } else {
            setMyTrips(data);
          }
        });
    }
  }, [userObject._id]);

  return (
    <div>
      {userObject ? (
        <div>
          <h3>{`Welcome back, ${userObject.username}`}</h3>
          {myTrips.length > 0 ? (
            <table className="table">
              <TableHead />
              <tbody>
                {myTrips.map((el) => (
                  <SavedTrip {...el} key={el._id} />
                ))}
              </tbody>
            </table>
          ) : (
            <p>You have not saved any trips yet</p>
          )}
        </div>
      ) : (
        "You need to log in to see your profile"
      )}
    </div>
  );
};

export default Profile;
