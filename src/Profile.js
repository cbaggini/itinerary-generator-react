import React, { useState, useEffect, useContext } from "react";
import { myContext } from "./Context";
import SavedTrip from "./SavedTrip";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

const Profile = () => {
  const userObject = useContext(myContext);
  const [myTrips, setMyTrips] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchTrips = () => {
    fetch(baseURL + "trips/" + userObject._id)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Could not load your trips");
        } else {
          setMyTrips(data);
        }
      });
  };

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
          fetchTrips();
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
          fetchTrips();
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
            setIsLoaded(true);
          }
        });
    }
  }, [userObject._id]);

  return (
    <div>
      {userObject.username && <h3>{`Welcome back, ${userObject.username}`}</h3>}
      {userObject.username && !isLoaded && (
        <div className="margin">Loading your trips, please wait...</div>
      )}
      {myTrips.length > 0 && isLoaded && (
        <>
          <h2>Your saved trips:</h2>
          <section className="tripContainer">
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
          </section>
        </>
      )}

      {myTrips.length === 0 && isLoaded && (
        <div className="margin">You have not saved any trips yet</div>
      )}
      {!userObject.username && (
        <div className="margin">You need to log in to see your profile</div>
      )}
    </div>
  );
};

export default Profile;
