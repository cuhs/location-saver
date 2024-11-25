import "./App.css";
import React, { useState } from "react";
import { AdvancedMarker, APIProvider, Map, Marker} from "@vis.gl/react-google-maps";

const CustomMap = () => {
  // shows marker on London by default
  const position = ({lat: 50, lng: 10});
  const GOOGLE_MAP_API = 'SOME_API_KEY';
  return (
    <div className="map-container">
      <APIProvider apiKey={GOOGLE_MAP_API}>
        <Map
          defaultZoom={13}
          defaultCenter={position}>
        </Map>
      </APIProvider>
    </div>
  );
}


export default CustomMap;