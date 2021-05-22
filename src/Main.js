import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Map from "./Map";
import SearchBar from "./SearchBar";

function Main() {
  const location = useLocation();
  let isLoaded_p = false;
  let allData_p = { dataFrom: {}, dataTo: {} };
  let form_p = {
    from: "",
    to: "",
    buffer: "",
    categories: [],
    timeInterval: "",
  };
  let routeData_p = {};
  let poiDetails1 = [];
  let reset = false;
  let saved = false;
  if (location.state && location.state.isLoaded_p) {
    isLoaded_p = location.state.isLoaded_p;
    allData_p = location.state.allData_p;
    routeData_p = location.state.routeData_p;
    poiDetails1 = location.state.poiDetails1;
    saved = location.state.saved;
  }

  if (location.state && location.state.reset) {
    reset = location.state.reset;
    saved = location.state.saved;
  }

  if (location.state && location.state.form_p) {
    form_p = location.state.form_p;
  }

  const [allData, setAllData] = useState(allData_p);
  const [form, setForm] = useState(form_p);
  const [routeData, setRouteData] = useState(routeData_p);
  const [isLoaded, setIsLoaded] = useState(isLoaded_p);
  const [poiDetails, setPoiDetails] = useState(poiDetails1);

  useEffect(() => {
    if (reset) {
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
    }
  }, [reset]);

  return (
    <>
      {isLoaded ? (
        <Map
          allData={allData}
          form={form}
          setForm={setForm}
          routeData={routeData}
          poiDetails={poiDetails}
          setRouteData={setRouteData}
          setIsLoaded={setIsLoaded}
          setAllData={setAllData}
          saved={saved}
          setPoiDetails={setPoiDetails}
        />
      ) : (
        <SearchBar
          allData={allData}
          form={form}
          setForm={setForm}
          setAllData={setAllData}
          setIsLoaded={setIsLoaded}
        />
      )}
    </>
  );
}

export default Main;
