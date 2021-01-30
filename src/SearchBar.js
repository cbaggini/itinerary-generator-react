import React, { useRef } from "react";

const ORS_KEY = process.env.REACT_APP_ORS_KEY;

const SearchBar = ({allData, setAllData, setRadius, setCategories, categories, setIsLoaded}) => {
	const from = useRef('initial value');
	const whereTo = useRef('initial value');
	const buffer = useRef('5');
	const categoryList = ['religion', 'natural', 'historic', 'cultural', 'architecture'];

	const search = async () => {
		setRadius(buffer.current.value);
		// Search for origin coordinates
		const dataFrom1 = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_KEY}&text=${from.current.value.replace(/ /g,'-')}`)
			.then(response => response.json())
			.catch((err) => {console.log("An error occurred: " + err);});
		//Search for destination coordinates
		const dataTo1 = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_KEY}&text=${whereTo.current.value.replace(/ /g,'-')}`)
			.then(response => response.json())
			.catch((err) => {console.log("An error occurred: " + err);});
		setAllData({...allData, dataFrom: dataFrom1, dataTo: dataTo1})
		setIsLoaded(true);
	}

	const toggleCategories = (e) => {
		if (categories.length > 0) {
			if ([...categories].includes(e.target.value)) {
				setCategories([...categories].slice(0,categories.indexOf(e.target.value)).concat([...categories].slice(categories.indexOf(e.target.value) + 1)));
				e.target.style.backgroundColor = "grey";
			} else {
				setCategories([...categories, e.target.value]);
				e.target.style.backgroundColor = "green";
			}
		} else {
			setCategories([e.target.value]);
			e.target.style.backgroundColor = "green";
		}
	}
	
	return (
		<div className="searchBar">
			<h1>Roadtrip itinerary generator</h1>
			<label htmlFor="from">Where are you leaving from?</label>
			<input id="from" type="text" ref={from} placeholder="from"></input>
			<label htmlFor="to">Where are you going to?</label>
			<input id="to" type="text" ref={whereTo} placeholder="to"></input>
		<div className="buffer">
			<label htmlFor="buffer">How many kilometers so you want to deviate from your route ? (between 1 and 30)</label>
			<input type="number" id="buffer" name="buffer" min="1" max="30" ref={buffer}/> 
		</div>
		<div>
			What type(s) of attractions would you like to visit?
		</div>
		<div className="buttons">
			{categoryList.map(el => <button type="button" className="attraction" key={el} value={el} onClick={toggleCategories}>{el.charAt(0).toUpperCase() + el.slice(1)}</button>)}
		</div>
		<button type="button" id="search" onClick={search}>Calculate your itinerary</button>
		</div>
	);
}

export default SearchBar;