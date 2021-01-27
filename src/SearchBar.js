import React, {useRef} from "react";
const ORS_KEY = process.env.REACT_APP_ORS_KEY;
const openrouteservice = require("openrouteservice-js");

const Geocode = new openrouteservice.Geocode({
  api_key: ORS_KEY
});

const SearchBar = ({setDataFrom, setDataTo}) => {
	const from = useRef('initial value');
	const whereTo = useRef('initial value');

	const search = () => {
		// Search for origin coordinates
		Geocode.geocode({text: from.current.value})
		.then(response => {setDataFrom(response);})
		.catch((err) => {console.log("An error occurred: " + err);});
		Geocode.clear();
		//Search for destination coordinates
		Geocode.geocode({text: whereTo.current.value})
		.then(response => {setDataTo(response);})
		.catch((err) => {console.log("An error occurred: " + err);});
		Geocode.clear();
	}
	
	return (
		<>
		<input type="text" ref={from} placeholder="from"></input>
		<input type="text" ref={whereTo} placeholder="to"></input>
		<button type="button" onClick={search}>Search</button>
		</>
	);
}

export default SearchBar;