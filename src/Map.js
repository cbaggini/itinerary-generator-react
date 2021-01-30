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

const Map = ({allData, radius, categories, setIsLoaded}) => {
	const [buffer, setBuffer] = useState({});
	const [selectedPois, setSelectedPois] = useState([]);
	const [updatedRoute, setUpdatedRoute] = useState({});

	const greenOptions = { color: 'green' };
	const redOptions = { color: 'red'};

	// if (route.features) {
	// 	console.log(route)
	// }

	useEffect(() => {
		if (allData.dataFrom.features && allData.dataTo.features && radius && categories.length > 0) {
			getRoute(allData, radius, categories, ORS_KEY, OTM_KEY, setSelectedPois, setUpdatedRoute, setBuffer);
		}
		
	}, [allData, radius, categories]);

	return (
		<>
		<button type="button" onClick={()=>setIsLoaded(false)}>Search again</button>
		<MapContainer center={[56, -1]} zoom={5} scrollWheelZoom={false}>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{allData.dataFrom.features && <Marker position={[allData.dataFrom.features[0].geometry.coordinates[1], allData.dataFrom.features[0].geometry.coordinates[0]]}>
				<Popup>{allData.dataFrom.features[0].properties.name}</Popup>
			</Marker>}
			{allData.dataTo.features && <Marker position={[allData.dataTo.features[0].geometry.coordinates[1], allData.dataTo.features[0].geometry.coordinates[0]]}>
				<Popup>{allData.dataTo.features[0].properties.name}</Popup>
			</Marker>}
			{updatedRoute.features && <>
			<Polyline id="line" positions={updatedRoute.features[0].geometry.coordinates.map(el => [el[1], el[0]])}/>
			<AutoZoom bounds={[[updatedRoute.features[0].bbox[1], updatedRoute.features[0].bbox[0]], [updatedRoute.features[0].bbox[3], updatedRoute.features[0].bbox[2]]]}/>
			</>}
			{buffer.geometry && <Polygon pathOptions={greenOptions} positions={buffer.geometry.coordinates} />}
			{selectedPois.length > 0 && selectedPois.map(el => <CircleMarker key={el.properties.xid} pathOptions={redOptions} radius={5} center={[el.geometry.coordinates[1], el.geometry.coordinates[0]] }>
				<Popup>{el.properties.name}</Popup>
			</CircleMarker>)}
		</MapContainer>
		</>
	);
}

export default Map;
