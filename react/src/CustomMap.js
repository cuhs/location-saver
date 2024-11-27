import "./App.css";
import React, { useState } from "react";
import { AdvancedMarker, APIProvider, Map, Marker} from "@vis.gl/react-google-maps";

const CustomMap = () => {
  const position = ({lat: 34.0722, lng: -118.4441});
  const GOOGLE_MAP_API = 'some_api_key';
  const [placeMarker, setPlaceMarker] = useState(false);

  const togglePlaceMarker = () => {
    setPlaceMarker(!placeMarker);
  };

  return (
    <div className="map-container">
      <button onClick={togglePlaceMarker}>
        {placeMarker ? "Disable Marker Placing" : "Enable Marker Placing"}
      </button>
      <APIProvider apiKey={GOOGLE_MAP_API}>
        <Map
          defaultZoom={16}
          defaultCenter={position}>
          <Marker position={position}></Marker>
        </Map>
      </APIProvider>
    </div>
  );
}

export default CustomMap;