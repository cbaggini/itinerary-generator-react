import React from "react";

const RouteInfo = ({allData, updatedRoute, selectedPois,setIsLoaded, setCategories}) => {
	return (
	<div className="routeInfo">
		<h1 className="title">Your suggested itinerary</h1>
		<p className="info">
		From {allData.dataFrom.features[0].properties.name} to{" "}
		{allData.dataTo.features[0].properties.name} -{" "}
		{Math.round(
			updatedRoute.features[0].properties.summary.distance / 10
		) / 100}{" "}
		km in approximately{" "}
		{Math.round(
			updatedRoute.features[0].properties.summary.duration / 3600
		)}{" "}
		hours, visiting:
		</p>
		<ul>
		{selectedPois.map((el) => (
			<li key={el.id}>{el.properties.name}</li>
		))}
		</ul>
		<button
		type="button"
		id="newSearch"
		onClick={() => {
			setIsLoaded(false);
			setCategories([]);
		}}
		>
		New itinerary
		</button>
	</div>
	)
}

export default RouteInfo;