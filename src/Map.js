import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

const openrouteservice = require("openrouteservice-js");
const ORS_KEY = process.env.REACT_APP_ORS_KEY;
const Directions = new openrouteservice.Directions({
			api_key: ORS_KEY
		});

const Map = ({dataFrom, dataTo}) => {
	const [route, setRoute] = useState({});
	const limeOptions = { color: 'lime' };

	useEffect(() => {
		if (dataFrom.features && dataTo.features) {
			Directions.calculate({
				coordinates: [dataFrom.features[0].geometry.coordinates, dataTo.features[0].geometry.coordinates],
				profile: 'driving-car',
				extra_info: ['waytype', 'steepness'],			
				format: 'geojson'
			})
			.then(response => {setRoute(response)})
			.catch(function(err) {
				var str = "An error occurred: " + err;
				console.log(str);
			});
		}
		
	}, [dataFrom, dataTo])
	if(route.features) {
		console.log(route.features[0].geometry.coordinates);
	}
	
	
	return (
		<MapContainer center={[51.505, -0.09]} zoom={5} scrollWheelZoom={false}>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{dataFrom.features && <Marker position={[dataFrom.features[0].geometry.coordinates[1], dataFrom.features[0].geometry.coordinates[0]]}>
				<Popup>
				A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker>}
			{dataTo.features && <Marker position={[dataTo.features[0].geometry.coordinates[1], dataTo.features[0].geometry.coordinates[0]]}/>}
			{route.features && 
			<Polyline positions={route.features[0].geometry.coordinates.map(el => [el[1], el[0]])} />}
		</MapContainer>
	);
}

export default Map;