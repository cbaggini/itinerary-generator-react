import React, { useContext } from "react";
import { myContext } from "./Context";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

const RouteInfo = ({ allData, routeData, form, setIsLoaded, setForm }) => {
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
        <button
          type="button"
          id="newSearch"
          onClick={() => {
            setIsLoaded(false);
            setForm({});
          }}
        >
          New itinerary
        </button>
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
