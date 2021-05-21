import React, { useState, useEffect } from "react";
import SavedTrip from "./SavedTrip";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

const Latest = () => {
  const [latestTrips, setLatestTrips] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    fetch(baseURL + "trips")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Could not load latest trips");
        } else {
          setLatestTrips(data);
          setIsLoaded(true);
        }
      });
  }, []);
  return (
    <section className="tripContainer">
      {!isLoaded && (
        <div className="margin">Loading latest trips, please wait...</div>
      )}
      {isLoaded &&
        latestTrips.map((el) => (
          <SavedTrip
            {...el}
            isPublic={el.public}
            poiDetails1={el.poiDetails}
            key={el._id}
          />
        ))}
    </section>
  );
};

export default Latest;
