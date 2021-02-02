import * as turf from '@turf/turf';

const getWaypoints = (route) => {
	// Create an array of cumulative times in n hours intervals
	const totalTime = route.features[0].properties.summary.duration;
	let timePoints = [];
	// This will have to change depending on user input
	const timeInterval = 21600;
	let timeCounter = timeInterval;
	while (timeCounter < totalTime) {
		timePoints.push(timeCounter);
		timeCounter += timeInterval;
	}
	if (timePoints.length === 0) {
		timePoints = [totalTime/2]
	}
	// Get coordinates of waypoints closest to each of the time points
	let cumTime = 0;
	let timeIndex = 0;
	let coordinateArray = [];
	const steps = route.features[0].properties.segments[0].steps
	for (let i=0; i<steps.length; i++) {
		if (cumTime < timePoints[timeIndex]) {
			cumTime += steps[i].duration;
		} else {
			coordinateArray.push(route.features[0].geometry.coordinates[steps[i].way_points[1]]);
			if (timeIndex < timePoints.length -1) {
				timeIndex++;
			} else {
				break
			}
		}
	}
	return coordinateArray;
}

const getRoute = async (allData, radius, categories, ORS_KEY, OTM_KEY, setSelectedPois, setUpdatedRoute, setBuffer, setIsComplete) => {

	// Get initial route from start and end coordinates
	const routeData = {
		coordinates: [allData.dataFrom.features[0].geometry.coordinates, allData.dataTo.features[0].geometry.coordinates],
		//options : {avoid_features: ["highways"]}
	};

	const initialRoute = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
		method: 'POST', 
		headers: {
		'Content-Type': 'application/json',
		'Authorization': ORS_KEY
		},
		body: JSON.stringify(routeData) 
	  })
	  .then(response => response.json())
	  .catch((err) => {console.log("An error occurred: " + err);});
	
	// Create buffer of selected radius
	const turfRoute = turf.lineString(initialRoute.features[0].geometry.coordinates.map(el => [el[1], el[0]]), { name: 'buffer' });
	const buffered = turf.buffer(turfRoute, radius, {units: "kilometers"});

	setBuffer(buffered);
	
	// Get pois
	const bbox = turf.bbox(buffered);
	const cats = categories.join('%2C');
	const pois = await fetch(`https://api.opentripmap.com/0.1/en/places/bbox?lon_min=${bbox[1]}&lat_min=${bbox[0]}&lon_max=${bbox[3]}&lat_max=${bbox[2]}&kinds=${cats}&format=geojson&apikey=${OTM_KEY}`)
		.then(response => response.json())
		.then(data => {
			// Select points in buffer area and with high popularity score
			if (data.features) {
				const points = data.features.filter(el => turf.booleanPointInPolygon(turf.point([el.geometry.coordinates[1], el.geometry.coordinates[0]]), buffered) && el.properties.rate === 7)
				return points;
			} else {
				return null;
			}
						
		})
	
	if (!pois) {
		throw new Error('no POIs found');
	} 
	// Get array of suggested pois, remove duplicates
	const coordinateArray = getWaypoints(initialRoute);
	const turfPois = turf.featureCollection(pois);
	let selectedPoisArray = [];
	for (let point of coordinateArray) {
		const selectedPoint = turf.point(point);
		const nearest = turf.nearestPoint(selectedPoint, turfPois);
		selectedPoisArray.push(nearest);
	}
	selectedPoisArray = selectedPoisArray.filter((el,index, arr) => arr.indexOf(arr.find(subel => subel.id === el.id)) === index);

	setSelectedPois(selectedPoisArray);

	// update route to visit all suggested pois
	const poiCoordinates = selectedPoisArray.map(el => el.geometry.coordinates);
	const newCoordinates = [allData.dataFrom.features[0].geometry.coordinates, ...poiCoordinates, allData.dataTo.features[0].geometry.coordinates];
	const radiusArray = new Array(newCoordinates.length).fill(-1);

	const updatedRouteData = {
		coordinates: newCoordinates,
		extra_info: ['waytype', 'steepness'],	
		radiuses : radiusArray
	};

	const updatedRoute = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
		method: 'POST', 
		headers: {
		'Content-Type': 'application/json',
		'Authorization': ORS_KEY
		},
		body: JSON.stringify(updatedRouteData) 
	  })
	  .then(response => response.json())
	  .catch((err) => {console.log("An error occurred: " + err);});
	
	if (!updatedRoute.features) {
		throw new Error('Updated route could not be calculated');
	} 

	setUpdatedRoute(updatedRoute);

	// Create buffer of updated route
	// const turfNewRoute = turf.lineString(updatedRoute.features[0].geometry.coordinates.map(el => [el[1], el[0]]), { name: 'buffer' });
	// const newBuffer = turf.buffer(turfNewRoute, radius, {units: "kilometers"});

	// setBuffer(newBuffer);
	setIsComplete(true);
}

export {getRoute};