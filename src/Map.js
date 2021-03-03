import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";

const AutoZoom = ({ bounds }) => {
  const map = useMap();
  map.fitBounds(bounds, { padding: [100, 100] });
  return null;
};

const Map = ({ allData, radius, categories, setIsLoaded, setCategories }) => {
  const [buffer, setBuffer] = useState({});
  const [allPois, setAllPois] = useState([]);
  const [selectedPois, setSelectedPois] = useState([]);
  const [updatedRoute, setUpdatedRoute] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [poiDetails, setPoiDetails] = useState([]);
  console.log(allPois);

  const greenOptions = { color: "green" };
  const redOptions = { color: "red" };
  const baseURL = process.env.PORT
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

  const getDetails = async (poisArray) => {
    let newPoisDetails = [];
    for (let i = 0; i < poisArray.length; i++) {
      const elDetails = await fetch(
        `${baseURL}poi?xid=${poisArray[i].id}`
      ).then((response) => response.json());
      newPoisDetails = newPoisDetails.concat(elDetails.poiInfo);
    }
    return newPoisDetails;
  };

  useEffect(() => {
    if (
      allData.dataFrom.features &&
      allData.dataTo.features &&
      radius &&
      categories.length > 0
    ) {
      const coordinates = [
        allData.dataFrom.features[0].geometry.coordinates,
        allData.dataTo.features[0].geometry.coordinates,
      ];
      const getRouteData = {
        coordinates: coordinates,
        radius: radius,
        categories: categories,
      };
      // fetch('http://localhost:8080/itinerary', {
      fetch(`${baseURL}itinerary`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getRouteData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.selectedPoisArray) {
            setBuffer(data.buffered);
            setSelectedPois(data.selectedPoisArray);
            setUpdatedRoute(data.updatedRoute);
            setAllPois(data.pois);
            setIsComplete(true);
          } else {
            alert("Could not calculate route. Please try another search");
            setIsLoaded(false);
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Could not calculate route. Please try another search");
          setIsLoaded(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData, radius, categories]);

  useEffect(() => {
    getDetails(selectedPois).then((data) => setPoiDetails(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPois]);

  return (
    <>
      {isComplete && updatedRoute.features && (
        <div className="routeInfo">
          <h1 className="title">Your suggested itinerary</h1>
          <p className="info">
            From {allData.dataFrom.features[0].properties.name} to{" "}
            {allData.dataTo.features[0].properties.name} -{" "}
            {Math.round(
              updatedRoute.features[0].properties.summary.distance / 10
            ) / 100}{" "}
            km in approximately{" "}
            {Math.round(
              updatedRoute.features[0].properties.summary.duration / 3600
            )}{" "}
            hours, visiting:
          </p>
          <ul>
            {selectedPois.map((el) => (
              <li key={el.id}>{el.properties.name}</li>
            ))}
          </ul>
          <button
            type="button"
            id="newSearch"
            onClick={() => {
              setIsLoaded(false);
              setCategories([]);
            }}
          >
            New itinerary
          </button>
        </div>
      )}
      <MapContainer center={[56, -1]} zoom={5} scrollWheelZoom={false}>
        {isComplete ? (
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <>
            <h1 className="loading">Calculating your itinerary...</h1>
            <h3 className="loading">
              Please be patient, long routes can take up to one minute to
              calculate
            </h3>
          </>
        )}
        {isComplete && allData.dataFrom.features && (
          <Marker
            position={[
              allData.dataFrom.features[0].geometry.coordinates[1],
              allData.dataFrom.features[0].geometry.coordinates[0],
            ]}
          >
            <Popup>{allData.dataFrom.features[0].properties.name}</Popup>
          </Marker>
        )}
        {isComplete && allData.dataTo.features && (
          <Marker
            position={[
              allData.dataTo.features[0].geometry.coordinates[1],
              allData.dataTo.features[0].geometry.coordinates[0],
            ]}
          >
            <Popup>{allData.dataTo.features[0].properties.name}</Popup>
          </Marker>
        )}
        {isComplete && updatedRoute.features && (
          <>
            <Polyline
              id="line"
              positions={updatedRoute.features[0].geometry.coordinates.map(
                (el) => [el[1], el[0]]
              )}
            />
            <AutoZoom
              bounds={[
                [
                  updatedRoute.features[0].bbox[1],
                  updatedRoute.features[0].bbox[0],
                ],
                [
                  updatedRoute.features[0].bbox[3],
                  updatedRoute.features[0].bbox[2],
                ],
              ]}
            />
          </>
        )}
        {isComplete && buffer.geometry && (
          <Polygon
            pathOptions={greenOptions}
            positions={buffer.geometry.coordinates}
          />
        )}
        {isComplete &&
          poiDetails.length > 0 &&
          poiDetails.map((el) => (
            <CircleMarker
              key={el.xid}
              pathOptions={redOptions}
              radius={5}
              center={[el.point.lat, el.point.lon]}
            >
              <Popup>
                <h1>{el.name}</h1>
                <img
                  className="popupImg"
                  alt={el.name}
                  src={el.preview.source}
                ></img>
                <div
                  dangerouslySetInnerHTML={{
                    __html: el.wikipedia_extracts.html,
                  }}
                ></div>
                <a href={el.wikipedia} target="_blank" rel="noreferrer">
                  See more on Wikipedia
                </a>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </>
  );
};

export default Map;
