import "./App.css";
import React, { useState } from "react";

import Footer from "./Footer";
import Map from "./Map";
import SearchBar from "./SearchBar";

function App() {
  const [allData, setAllData] = useState({ dataFrom: {}, dataTo: {} });
  const [form, setForm] = useState({});
  const [routeData, setRouteData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="App">
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
      <Footer />
    </div>
  );
}

export default App;
