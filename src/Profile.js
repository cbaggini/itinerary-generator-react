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

  const togglePrivacy = (tripId, isPublic) => {
    fetch(`${baseURL}trips/${tripId}`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": baseURL,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newData: { public: !isPublic } }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Successfully saved.") {
          fetch(baseURL + "trips/" + userObject._id)
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                alert("Could not load your trips");
              } else {
                setMyTrips(data);
              }
            });
        } else {
          alert("Could not update trip");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Could not update trip");
      });
  };

  const deleteTrip = (tripId) => {
    fetch(`${baseURL}trips/${tripId}`, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": baseURL,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Successfully deleted.") {
          fetch(baseURL + "trips/" + userObject._id)
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                alert("Could not load your trips");
              } else {
                setMyTrips(data);
              }
            });
        } else {
          alert("Could not delete trip");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Could not delete trip");
      });
  };

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
      {userObject.username ? (
        <div>
          <h3>{`Welcome back, ${userObject.username}`}</h3>
          {myTrips.length > 0 ? (
            <table className="table">
              <TableHead profile={true} />
              <tbody>
                {myTrips.map((el) => (
                  <SavedTrip
                    profile={true}
                    isPublic={el.public}
                    togglePrivacy={togglePrivacy}
                    deleteTrip={deleteTrip}
                    {...el}
                    poiDetails1={el.poiDetails}
                    key={el._id}
                  />
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
