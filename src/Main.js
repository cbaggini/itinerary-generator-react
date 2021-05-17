import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import Map from "./Map";
import SearchBar from "./SearchBar";

function Main() {
  const location = useLocation();
  let isLoaded_p = false;
  let allData_p = { dataFrom: {}, dataTo: {} };
  let form_p = {};
  let routeData_p = {};
  if (location.state) {
    isLoaded_p = location.state.isLoaded_p;
    allData_p = location.state.allData_p;
    form_p = location.state.form_p;
    routeData_p = location.state.routeData_p;
  }
  const [allData, setAllData] = useState(allData_p);
  const [form, setForm] = useState(form_p);
  const [routeData, setRouteData] = useState(routeData_p);
  const [isLoaded, setIsLoaded] = useState(isLoaded_p);

  return (
    <>
      {isLoaded ? (
        <Map
          allData={allData}
          form={form}
          setForm={setForm}
          routeData={routeData}
          setRouteData={setRouteData}
          setIsLoaded={setIsLoaded}
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
