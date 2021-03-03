import React, { useRef } from "react";

const SearchBar = ({
  allData,
  setAllData,
  setRadius,
  setCategories,
  categories,
  setIsLoaded,
}) => {
  const from = useRef("initial value");
  const whereTo = useRef("initial value");
  const buffer = useRef("5");
  const categoryList = [
    "religion",
    "natural",
    "historic",
    "cultural",
    "architecture",
  ];

  const baseURL = process.env.PORT
    ? "https://itinerary-generator-node.nw.r.appspot.com/"
    : "http://localhost:8080/";

  const search = async () => {
    if (
      from.current.value &&
      whereTo.current.value &&
      buffer.current.value &&
      categories.length > 0
    ) {
      setRadius(buffer.current.value);

      // Geocode origin
      const dataFrom1 = await fetch(
        `${baseURL}geocode?text=${from.current.value.replace(/ /g, "-")}`
      )
        .then((response) => response.json())
        .catch((err) => {
          console.log("An error occurred: " + err);
        });
      // Geocode destination
      const dataTo1 = await fetch(
        `${baseURL}geocode?text=${whereTo.current.value.replace(/ /g, "-")}`
      )
        .then((response) => response.json())
        .catch((err) => {
          console.log("An error occurred: " + err);
        });
      if (dataFrom1.queryData.features && dataTo1.queryData.features) {
        setAllData({
          ...allData,
          dataFrom: dataFrom1.queryData,
          dataTo: dataTo1.queryData,
        });
        setIsLoaded(true);
      } else if (dataFrom1.queryData.features) {
        alert("Destination not found");
      } else {
        alert("Origin not found");
      }
    } else {
      alert("You need to fill in all the fields in the form");
    }
  };

  const toggleCategories = (e) => {
    if (categories.length > 0) {
      if ([...categories].includes(e.target.value)) {
        setCategories(
          [...categories]
            .slice(0, categories.indexOf(e.target.value))
            .concat(
              [...categories].slice(categories.indexOf(e.target.value) + 1)
            )
        );
        e.target.style.backgroundColor = "grey";
      } else {
        setCategories([...categories, e.target.value]);
        e.target.style.backgroundColor = "green";
      }
    } else {
      setCategories([e.target.value]);
      e.target.style.backgroundColor = "green";
    }
  };

  return (
    <div className="searchBar">
      <h1>Roadtrip itinerary generator</h1>
      <label htmlFor="from">Where are you leaving from?</label>
      <input id="from" type="text" ref={from} placeholder="from"></input>
      <label htmlFor="to">Where are you going to?</label>
      <input id="to" type="text" ref={whereTo} placeholder="to"></input>
      <div className="buffer">
        <label htmlFor="buffer">
          How many kilometers do you want to deviate from your route ? (between
          1 and 30)
        </label>
        <input
          type="number"
          id="buffer"
          name="buffer"
          min="1"
          max="30"
          ref={buffer}
        />
      </div>
      <div>What type(s) of attractions would you like to visit?</div>
      <div className="buttons">
        {categoryList.map((el) => (
          <button
            type="button"
            className="attraction"
            key={el}
            value={el}
            onClick={toggleCategories}
          >
            {el.charAt(0).toUpperCase() + el.slice(1)}
          </button>
        ))}
      </div>
      <button type="button" id="search" onClick={search}>
        Calculate your itinerary
      </button>
    </div>
  );
};

export default SearchBar;
