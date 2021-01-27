import './App.css';
import React, {useState} from "react";
import Footer from './Footer';
import Map from './Map';
import SearchBar from './SearchBar';

function App() {
	const [dataFrom, setDataFrom] = useState({});
	const [dataTo, setDataTo] = useState({});

	return (
		<div className="App">
			<SearchBar setDataFrom={setDataFrom} setDataTo={setDataTo}/>
			<Map dataFrom={dataFrom} dataTo={dataTo} />
			<Footer/>
		</div>
	);
}

export default App;
