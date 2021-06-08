import React from "react";

const Loading = () => {
	return (
		<>
			<div className="loadingPage">
				<div className="loadingPop">
					<h1 className="loading">Calculating your itinerary...</h1>
					<h3 className="loading">Please be patient, long routes can take up to one minute to calculate</h3>
				</div>
			</div>
		</>
	)
}

export default Loading;