import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
  Popup,
  Polygon,
  ZoomControl,
} from "react-leaflet";
import PoiPopup from "./PoiPopup";
import AutoZoom from "./AutoZoom";
import Loading from "./Loading";
import RouteInfo from "./RouteInfo";

const Map = ({
  allData,
  setIsLoaded,
  form,
  setForm,
  routeData,
  poiDetails,
  setRouteData,
  setAllData,
  setPoiDetails,
  saved,
}) => {
  const [isComplete, setIsComplete] = useState(false);
  console.log(poiDetails);
  console.log(routeData);
  console.log(saved);
  const greenOptions = { color: "green" };
  const redOptions = { color: "red" };
  const baseURL =
    process.env.REACT_APP_MODE === "prod"
      ? "https://itinerary-generator-node.nw.r.appspot.com/"
      : "http://localhost:8080/";

  const resetTrip = () => {
    setIsLoaded(false);
    setForm({
      from: "",
      to: "",
      buffer: "",
      categories: [],
      timeInterval: "",
    });
    setAllData({ dataFrom: {}, dataTo: {} });
    setRouteData({});
    setPoiDetails([]);
  };

  const updateTrip = (xid) => {
    console.log(xid);
    // TODO: use xid to add/remove excluded key to poiDetails and routeData.pois, then calculate itinerary with updated pois object
    // In backend, check if req.body has pois field and do not do extra query?
  };

  useEffect(() => {
    if (
      allData.dataFrom.features &&
      allData.dataTo.features &&
      form.buffer &&
      form.categories.length > 0 &&
      form.timeInterval &&
      !saved
    ) {
      const coordinates = [
        allData.dataFrom.features[0].geometry.coordinates,
        allData.dataTo.features[0].geometry.coordinates,
      ];
      const getRouteData = {
        coordinates: coordinates,
        ...form,
      };
      fetch(`${baseURL}itinerary`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": baseURL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getRouteData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.selectedPoisArray) {
            setRouteData({ ...data });
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
  }, [allData, form, baseURL, setIsLoaded, setRouteData, saved]);

  useEffect(() => {
    if (saved) {
      setIsComplete(true);
    }
  }, [saved]);

  useEffect(() => {
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
    if (routeData.selectedPoisArray && !saved) {
      getDetails(routeData.selectedPoisArray).then((data) =>
        setPoiDetails(data)
      );
    }
  }, [routeData.selectedPoisArray, baseURL, saved, setPoiDetails]);

  return (
    <>
      {isComplete && routeData.selectedPoisArray && (
        <RouteInfo
          allData={allData}
          routeData={routeData}
          form={form}
          poiDetails={poiDetails}
          resetTrip={resetTrip}
        />
      )}
      <div className="mapWrapper">
      <MapContainer
        center={[56, -1]}
        zoom={5}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        {isComplete ? (
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <Loading />
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
        {isComplete &&
          routeData.updatedRoute &&
          routeData.updatedRoute.features && (
            <>
              <Polyline
                id="line"
                positions={routeData.updatedRoute.features[0].geometry.coordinates.map(
                  (el) => [el[1], el[0]]
                )}
              />
              <AutoZoom
                bounds={[
                  [
                    routeData.updatedRoute.features[0].bbox[1],
                    routeData.updatedRoute.features[0].bbox[0],
                  ],
                  [
                    routeData.updatedRoute.features[0].bbox[3],
                    routeData.updatedRoute.features[0].bbox[2],
                  ],
                ]}
              />
            </>
          )}
        {isComplete && routeData.buffered && routeData.buffered.geometry && (
          <Polygon
            pathOptions={greenOptions}
            positions={routeData.buffered.geometry.coordinates}
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
                <PoiPopup poi={el} updateTrip={updateTrip} />
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
      </div>
    </>
  );
};

export default Map;
