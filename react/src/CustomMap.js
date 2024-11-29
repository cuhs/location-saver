import "./App.css";
import React, { useState, useEffect } from "react";
import { AdvancedMarker, APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import axios from 'axios'

const CustomMap = () => {
  const position = { lat: 34.0722, lng: -118.4441 };
  const GOOGLE_MAP_API = 'some-api-key';
  const [placeMarker, setPlaceMarker] = useState(false);
  const [markers, setMarkers] = useState([position]);

  const togglePlaceMarker = () => {
    setPlaceMarker(!placeMarker);
  };

  const handleMapClick = (event) => {
    if (placeMarker) {
      const newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      setMarkers([...markers, newMarker]);
    }
  };

  const handleGetLocation = async () => {
    try {
      const response = await axios.post("http://localhost:5001/v1/get-location", {
        category: "UCLA buildings" // Update with the actual location name
      });
      const fetchedMarkers = response.data.map(location => ({
        lat: location.location_lattitude,
        lng: location.location_longitude
      }));
      setMarkers(fetchedMarkers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleGetLocation();
    console.log(markers)
  }, []);
  return (
    <div className="map-container">
      <button onClick={togglePlaceMarker}>
        {placeMarker ? "Disable Marker Placing" : "Enable Marker Placing"}
      </button>
      <APIProvider apiKey={GOOGLE_MAP_API}>
        <Map
          defaultZoom={16}
          defaultCenter={position}
          onClick={handleMapClick}>
          
          
        </Map>
      </APIProvider>
    </div>
  );
}

export default CustomMap;