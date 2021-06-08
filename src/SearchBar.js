import React, { useRef } from "react";

const SearchBar = ({ allData, setAllData, setIsLoaded, form, setForm }) => {
  const from = useRef(form.from);
  const whereTo = useRef(form.to);
  const buffer = useRef(form.buffer);
  const timeInterval = useRef(form.timeInterval);
  const categoryList = [
    "religion",
    "natural",
    "historic",
    "cultural",
    "architecture",
  ];
  const timeIntervals = [7200, 10800, 14400, 21600, 28800];
  const baseURL =
    process.env.REACT_APP_MODE === "prod"
      ? "https://itinerary-generator-node.nw.r.appspot.com/"
      : "http://localhost:8080/";

  const search = async () => {
    if (
      from.current.value &&
      whereTo.current.value &&
      buffer.current.value &&
      form.categories.length > 0 &&
      timeInterval.current.value
    ) {
      setForm({
        ...form,
        buffer: buffer.current.value,
        timeInterval: timeInterval.current.value,
      });

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
    if (form.categories && form.categories.length > 0) {
      if ([...form.categories].includes(e.target.value)) {
        const newCategories = [...form.categories]
          .slice(0, form.categories.indexOf(e.target.value))
          .concat(
            [...form.categories].slice(
              form.categories.indexOf(e.target.value) + 1
            )
          );
        setForm({ ...form, categories: newCategories });
        e.target.className = "attraction grey";
      } else {
        const newCategories = [...form.categories, e.target.value];
        setForm({ ...form, categories: newCategories });
        e.target.className = "attraction green";
      }
    } else {
      setForm({ ...form, categories: [e.target.value] });
      e.target.className = "attraction green";
    }
  };

  return (
    <div className="searchContainer">
      <div className="central-container">
        <div className="brandingContainer">
          <div className="branding">
            <h1>RoadTrip <span>itinerary generator</span></h1>
            <div className="logo"></div>
          </div>
        </div>

        <div className="searchBar">
          <form>
            <div class="searchBar-top">
              <div class="input-row">
                <label htmlFor="from">Where are you leaving from?</label>
                <input
                  id="from"
                  type="text"
                  defaultValue={form.from}
                  ref={from}
                  placeholder="from"
                ></input>
              </div><br />
              <div class="input-row"><label htmlFor="to">Where are you going to?</label>
                <input
                  id="to"
                  type="text"
                  defaultValue={form.to}
                  ref={whereTo}
                  placeholder="to"
                ></input>
              </div><br />
              <div className="buffer">
                <div class="input-row"><label htmlFor="buffer">
                  How many kilometers do you want to deviate from your route ? (between
                  1 and 30)
        </label>
                  <input
                    defaultValue={form.buffer}
                    type="number"
                    id="buffer"
                    name="buffer"
                    min="1"
                    max="30"
                    ref={buffer}
                  />
                </div>
              </div><br />
              <div>What type(s) of attractions would you like to visit?</div>
              <div className="buttons">
                {categoryList.map((el) => (
                  <button
                    type="button"
                    class="select"
                    className={
                      form.categories.includes(el)
                        ? "attraction active"
                        : "attraction unactive"
                    }
                    key={el}
                    value={el}
                    onClick={toggleCategories}
                  >
                    {el.charAt(0).toUpperCase() + el.slice(1)}
                  </button>
                ))}
              </div><br />
              <div>
                <div class="input-row"><label htmlFor="time">How often would you like to stop?</label>
                  <select id="time" defaultValue={form.timeInterval} ref={timeInterval}>
                    <option value=""></option>
                    {timeIntervals.map((el) => (
                      <option key={el} value={el}>
                        {el / 3600} hours
                      </option>
                    ))}
                  </select>
                </div>
              </div><br />
            </div>
            <div class="actions-container">
              <button type="button" id="search" onClick={search}>
                Calculate your itinerary
      </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
