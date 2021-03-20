import React from "react";

const PoiPopup = ({poi}) => {
	return (
	<>
	<h1>{poi.name}</h1>
	<img
		className="popupImg"
		alt={poi.name}
		src={poi.preview.source}
	></img>
	<div
		dangerouslySetInnerHTML={{
		__html: poi.wikipedia_extracts.html,
		}}
	></div>
	<a href={poi.wikipedia} target="_blank" rel="noreferrer">
		See more on Wikipedia
	</a>
	</>
	)
}

export default PoiPopup;