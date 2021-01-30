import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, Popup, Polygon, useMap } from 'react-leaflet';
import { getRoute } from "./helper";

const ORS_KEY = process.env.REACT_APP_ORS_KEY;
const OTM_KEY = process.env.REACT_APP_OTM_KEY;

const AutoZoom = ({ bounds }) => {
	const map = useMap();
	map.fitBounds(bounds);
	return null;
}

const Map = ({allData, radius, categories, setIsLoaded, setCategories}) => {
	const [buffer, setBuffer] = useState({});
	const [selectedPois, setSelectedPois] = useState([]);
	const [updatedRoute, setUpdatedRoute] = useState({});
	const [isComplete, setIsComplete] = useState(false);

	const greenOptions = { color: 'green' };
	const redOptions = { color: 'red'};

	// if (route.features) {
	// 	console.log(route)
	// }

	useEffect(() => {
		if (allData.dataFrom.features && allData.dataTo.features && radius && categories.length > 0) {
			getRoute(allData, radius, categories, ORS_KEY, OTM_KEY, setSelectedPois, setUpdatedRoute, setBuffer, setIsComplete);
		}
		
	}, [allData, radius, categories]);

	return (
		<>
		{(isComplete && updatedRoute.features) &&	<div className="routeInfo">
			<h1 className="title">Your suggested itinerary</h1>
			<p className="info">From {allData.dataFrom.features[0].properties.name} to {allData.dataTo.features[0].properties.name} - {Math.round(updatedRoute.features[0].properties.summary.distance/10) /100 } km 
			in approximately {Math.round(updatedRoute.features[0].properties.summary.duration/3600)} hours, visiting:</p>
			<ul>
				{selectedPois.map(el => <li key={el.id}>{el.properties.name}</li>)}
			</ul>
			<button type="button" id="newSearch" onClick={()=>{setIsLoaded(false); setCategories([])}}>New itinerary</button>
		</div>}
		<MapContainer center={[56, -1]} zoom={5} scrollWheelZoom={false}>
			{ isComplete ?<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/> : <h1 className="loading">Calculating your itinerary...</h1>}
			{(isComplete && allData.dataFrom.features) && <Marker position={[allData.dataFrom.features[0].geometry.coordinates[1], allData.dataFrom.features[0].geometry.coordinates[0]]}>
				<Popup>{allData.dataFrom.features[0].properties.name}</Popup>
			</Marker>}
			{(isComplete && allData.dataTo.features) && <Marker position={[allData.dataTo.features[0].geometry.coordinates[1], allData.dataTo.features[0].geometry.coordinates[0]]}>
				<Popup>{allData.dataTo.features[0].properties.name}</Popup>
			</Marker>}
			{(isComplete && updatedRoute.features) && <>
			<Polyline id="line" positions={updatedRoute.features[0].geometry.coordinates.map(el => [el[1], el[0]])}/>
			<AutoZoom bounds={[[updatedRoute.features[0].bbox[1], updatedRoute.features[0].bbox[0]], [updatedRoute.features[0].bbox[3], updatedRoute.features[0].bbox[2]]]}/>
			</>}
			{(isComplete && buffer.geometry) && <Polygon pathOptions={greenOptions} positions={buffer.geometry.coordinates} />}
			{(isComplete && selectedPois.length) > 0 && selectedPois.map(el => <CircleMarker key={el.properties.xid} pathOptions={redOptions} radius={5} center={[el.geometry.coordinates[1], el.geometry.coordinates[0]] }>
				<Popup>{el.properties.name}</Popup>
			</CircleMarker>)}
		</MapContainer>
		</>
	);
}

export default Map;
