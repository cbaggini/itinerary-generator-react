import "./App.css";
import React, { useState } from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import Footer from "./Footer";
import Map from "./Map";
import SearchBar from "./SearchBar";

function App() {
  const [allData, setAllData] = useState({ dataFrom: {}, dataTo: {} });
  const [radius, setRadius] = useState(5);
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <RecoilRoot>
      <div className="App">
        {isLoaded ? (
          <Map
            allData={allData}
            radius={radius}
            categories={categories}
            setIsLoaded={setIsLoaded}
            setCategories={setCategories}
          />
        ) : (
          <SearchBar
            allData={allData}
            setAllData={setAllData}
            setRadius={setRadius}
            setCategories={setCategories}
            categories={categories}
            setIsLoaded={setIsLoaded}
          />
        )}
        <Footer />
      </div>
    </RecoilRoot>
  );
}

export default App;
