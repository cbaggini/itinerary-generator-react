import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, Popup, Polygon, useMap } from 'react-leaflet';
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

const Map = ({dataFrom, dataTo, radius, categories}) => {
	const [route, setRoute] = useState({});
	const [buffer, setBuffer] = useState({});
	const [poi, setPoi] = useState([]);

	const greenOptions = { color: 'green' };
	const redOptions = { color: 'red'};

	if (route.features) {
		console.log(route)
	}

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
		if (buffer.geometry && categories.length > 0) {
			const bbox = turf.bbox(buffer);
			const cats = categories.join('%2C');
			const bufferPolygon = turf.polygon(buffer.geometry.coordinates)
			fetch(`https://api.opentripmap.com/0.1/en/places/bbox?lon_min=${bbox[1]}&lat_min=${bbox[0]}&lon_max=${bbox[3]}&lat_max=${bbox[2]}&kinds=${cats}&format=geojson&apikey=${OTM_KEY}`)
			.then(response => response.json())
			.then(data => {
				// Select points in buffer area and with high popularity score
				const points = data.features.filter(el => turf.booleanPointInPolygon(turf.point([el.geometry.coordinates[1], el.geometry.coordinates[0]]), bufferPolygon) && el.properties.rate === 7)
				console.log(points)
				setPoi(points);
				// split route in n segments, each taking 6 hours (get array of points)
				// find closest poi to each point and save them to state variable that will be drawn
				// recalculate route to visit suggested pois

			})
		}
	}, [buffer, categories])
	
	return (
		<MapContainer center={[56, -1]} zoom={5} scrollWheelZoom={false}>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{dataFrom.features && <Marker position={[dataFrom.features[0].geometry.coordinates[1], dataFrom.features[0].geometry.coordinates[0]]}>
				<Popup>{dataFrom.features[0].properties.name}</Popup>
			</Marker>}
			{dataTo.features && <Marker position={[dataTo.features[0].geometry.coordinates[1], dataTo.features[0].geometry.coordinates[0]]}>
				<Popup>{dataTo.features[0].properties.name}</Popup>
			</Marker>}
			{route.features && <>
			<Polyline id="line" positions={route.features[0].geometry.coordinates.map(el => [el[1], el[0]])}/>
			<AutoZoom bounds={[[route.features[0].bbox[1], route.features[0].bbox[0]], [route.features[0].bbox[3], route.features[0].bbox[2]]]}/>
			</>}
			{buffer.geometry && <Polygon pathOptions={greenOptions} positions={buffer.geometry.coordinates} />}
			{poi.length > 0 && poi.map(el => <CircleMarker key={el.properties.xid} pathOptions={redOptions} radius={5} center={[el.geometry.coordinates[1], el.geometry.coordinates[0]] }>
				<Popup>{el.properties.name}</Popup>
			</CircleMarker>)}
		</MapContainer>
	);
}

export default Map;
