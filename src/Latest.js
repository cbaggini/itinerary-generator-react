import React, { useState, useEffect } from "react";
import SavedTrip from "./SavedTrip";

const baseURL =
  process.env.REACT_APP_MODE === "prod"
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

const Latest = () => {
  const [latestTrips, setLatestTrips] = useState([]);
  useEffect(() => {
    fetch(baseURL + "trips")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Could not load latest trips");
        } else {
          setLatestTrips(data);
        }
      });
  }, []);
  console.log(latestTrips);
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">From</th>
          <th scope="col">To</th>
          <th scope="col">Deviation (km)</th>
          <th scope="col">Attraction types</th>
          <th scope="col">Frequency of stops</th>
          <th scope="col">Last updated on</th>
          <th scope="col">See itinerary</th>
        </tr>
      </thead>
      <tbody>
        {latestTrips.map((el) => (
          <SavedTrip {...el} key={el._id} />
        ))}
      </tbody>
    </table>
  );
};

export default Latest;
