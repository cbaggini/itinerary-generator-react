import React from "react";

const PoiPopup = ({ poi }) => {
  const wikipedia_extracts = poi.wikipedia_extracts
    ? poi.wikipedia_extracts.html
    : "No description available";
  return (
    <>
      <h4>{poi.name}</h4>
      <img className="popupImg" alt={poi.name} src={poi.preview.source}></img>
      <div
        dangerouslySetInnerHTML={{
          __html: wikipedia_extracts,
        }}
      ></div>
      <a href={poi.wikipedia} target="_blank" rel="noreferrer">
        See more on Wikipedia
      </a>
    </>
  );
};

export default PoiPopup;
