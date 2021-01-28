import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, Polygon, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';

const openrouteservice = require("openrouteservice-js");
const ORS_KEY = process.env.REACT_APP_ORS_KEY;
const OTM_KEY = process.env.REACT_APP_OTM_KEY;
const Directions = new openrouteservice.Directions({
			api_key: ORS_KEY
		});

const AutoZoom = ({ bounds }) => {
	const map = useMap();
	map.fitBounds(bounds);
	return null;
}

const Map = ({dataFrom, dataTo, radius}) => {
	const [route, setRoute] = useState({});
	const [buffer, setBuffer] = useState({});

	const colorOptions = { color: 'green' }

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
		
	}, [dataFrom, dataTo]);

	useEffect(() => {
		if (route.features && radius) {
			const turfRoute = turf.lineString(route.features[0].geometry.coordinates.map(el => [el[1], el[0]]), { name: 'buffer' });
			const buffered = turf.buffer(turfRoute, radius, {units: "kilometers"});
			setBuffer(buffered);
		}
	}, [route, radius])

	useEffect(() => {
		if (buffer.geometry) {
			const bbox = turf.bbox(buffer);
			console.log(bbox)
			fetch(`http://api.opentripmap.com/0.1/ru/places/bbox?lon_min=${bbox[1]}&lat_min=${bbox[0]}&lon_max=${bbox[3]}&lat_max=${bbox[2]}&kinds=churches&format=geojson&apikey=${OTM_KEY}`)
			.then(response => response.json())
			.then(data => console.log(data))
		}
	}, [buffer])
	
	return (
		<MapContainer center={[56, -1]} zoom={5} scrollWheelZoom={false}>
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
			{route.features && <>
			<Polyline id="line" positions={route.features[0].geometry.coordinates.map(el => [el[1], el[0]])}/>
			<AutoZoom bounds={[[route.features[0].bbox[1], route.features[0].bbox[0]], [route.features[0].bbox[3], route.features[0].bbox[2]]]}/>
			</>}
			{buffer.geometry && <Polygon pathOptions={colorOptions} positions={buffer.geometry.coordinates} />}
		</MapContainer>
	);
}

export default Map;
