import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { myContext } from "./Context";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

const RouteInfo = ({ allData, routeData, form, poiDetails, resetTrip }) => {
  const userObject = useContext(myContext);

  const saveTrip = () => {
    fetch(`${baseURL}trips`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": baseURL,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allData,
        routeData,
        form,
        poiDetails,
        userId: userObject._id,
        public: true,
        created: new Date(),
        updated: new Date(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "saved") {
          window.location.href = "/profile";
        } else {
          alert("Could not save trip");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Could not save trip");
      });
  };
  return (
    <div className="routeInfo">
      <h1 className="title">Your suggested itinerary</h1>
      <p className="info">
        From {allData.dataFrom.features[0].properties.name} to{" "}
        {allData.dataTo.features[0].properties.name} -{" "}
        {Math.round(
          routeData.updatedRoute.features[0].properties.summary.distance / 10
        ) / 100}{" "}
        km in approximately{" "}
        {Math.round(
          routeData.updatedRoute.features[0].properties.summary.duration / 3600
        )}{" "}
        hours, visiting:
      </p>
      <ul>
        {routeData.selectedPoisArray.map((el) => (
          <li key={el.id}>{el.properties.name}</li>
        ))}
      </ul>
      <div>
        <Link
          to={{
            pathname: "/",
            state: {
              reset: true,
              saved: false,
            },
          }}
        >
          <button type="button" id="newSearch" onClick={resetTrip}>
            New itinerary
          </button>
        </Link>

        {userObject.username ? (
          <button type="button" id="save" onClick={saveTrip}>
            Save your trip
          </button>
        ) : (
          "You need to be logged in to save your trips!"
        )}
      </div>
    </div>
  );
};

export default RouteInfo;
