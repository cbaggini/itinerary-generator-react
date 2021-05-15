import React, { useState } from "react";

import Map from "./Map";
import SearchBar from "./SearchBar";

function Main() {
  const [allData, setAllData] = useState({ dataFrom: {}, dataTo: {} });
  const [form, setForm] = useState({});
  const [routeData, setRouteData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

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
