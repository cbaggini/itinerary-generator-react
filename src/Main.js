import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Map from "./Map";
import SearchBar from "./SearchBar";

function Main() {
  const location = useLocation();
  let isLoaded_p = false;
  let allData_p = { dataFrom: {}, dataTo: {} };
  let form_p = {};
  let routeData_p = {};
  let poiDetails1 = [];
  let reset = false;
  if (location.state && location.state.isLoaded_p) {
    isLoaded_p = location.state.isLoaded_p;
    allData_p = location.state.allData_p;
    form_p = location.state.form_p;
    routeData_p = location.state.routeData_p;
    poiDetails1 = location.state.poiDetails1;
  }

  if (location.state && location.state.reset) {
    reset = location.state.reset;
  }

  const [allData, setAllData] = useState(allData_p);
  const [form, setForm] = useState(form_p);
  const [routeData, setRouteData] = useState(routeData_p);
  const [isLoaded, setIsLoaded] = useState(isLoaded_p);

  useEffect(() => {
    if (reset) {
      setIsLoaded(false);
      setForm({});
      setAllData({ dataFrom: {}, dataTo: {} });
      setRouteData({});
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
          poiDetails1={poiDetails1}
          setRouteData={setRouteData}
          setIsLoaded={setIsLoaded}
          setAllData={setAllData}
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
