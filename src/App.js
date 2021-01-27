import './App.css';
import React, {useState} from "react";
import Footer from './Footer';
import Map from './Map';
import SearchBar from './SearchBar';

function App() {
	const [dataFrom, setDataFrom] = useState({});
	const [dataTo, setDataTo] = useState({});
	const [radius, setRadius] = useState(5);

	return (
		<div className="App">
			<SearchBar setDataFrom={setDataFrom} setDataTo={setDataTo} radius={radius} setRadius={setRadius}/>
			<Map dataFrom={dataFrom} dataTo={dataTo} radius={radius}/>
			<Footer/>
		</div>
	);
}

export default App;
