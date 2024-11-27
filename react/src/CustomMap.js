import "./App.css";
import React, { useState, useEffect } from "react";
import { AdvancedMarker, APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const CustomMap = () => {
  const position = { lat: 34.0722, lng: -118.4441 };
  const GOOGLE_MAP_API = 'some_api_key';
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

  useEffect(() => {
    fetch("http://localhost:5001/v1/get-location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ body: "some parameter" })
    })
      .then(response => response.json())
      .then(data => {
        const fetchedMarkers = data.map(location => ({
          lat: location.lat,
          lng: location.lng
        }));
        setMarkers(fetchedMarkers);
      })
      .catch(error => console.error("Error fetching data:", error));
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
          {markers.map((marker, index) => (
            <Marker key={index} position={marker}></Marker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

export default CustomMap;