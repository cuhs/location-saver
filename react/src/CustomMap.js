import "./App.css";
import React, { useState } from "react";
import { AdvancedMarker, APIProvider, Map, Marker} from "@vis.gl/react-google-maps";

const CustomMap = () => {
  // shows marker on London by default
  const position = ({lat: 34.0722, lng: -118.4441});
  const GOOGLE_MAP_API = 'some_api_key';
  return (
    <div className="map-container">
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