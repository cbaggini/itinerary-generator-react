import {useMap} from "react-leaflet";

const AutoZoom = ({ bounds }) => {
  const map = useMap();
  map.fitBounds(bounds, { padding: [100, 100] });
  return null;
};

export default AutoZoom;