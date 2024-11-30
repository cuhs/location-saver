import "./App.css";
import React, { useState, useEffect } from "react";
import { AdvancedMarker, APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import axios from 'axios'

const CustomMap = () => {
  const position = { lat: 34.0722, lng: -118.4441 };
  const GOOGLE_MAP_API = 'some-api-key';
  const [placeMarker, setPlaceMarker] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  
  const togglePlaceMarker = () => {
    setPlaceMarker(!placeMarker);
  };

  const handleMapClick = async (event) => {
    console.log("in handleMapClick", event.detail.latLng)
    
    const newMarker = { lat: event.detail.latLng.lat, lng: event.detail.latLng.lng };
    setMarkers([...markers, newMarker]);
    console.log(newMarker)
    try {
      await axios.post("http://localhost:5001/v1/add-location", {
        name: "New Location", // Update with the actual location name
        category: "UCLA buildings", // Update with the actual category
        user: "defaultUser", // Update with the actual user
        lng: newMarker.lng,
        lat: newMarker.lat
      });
      console.log("Location added successfully.");
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleGetLocation = async () => {
    try {
      const response = await axios.post("http://localhost:5001/v1/get-location", {
        category: "UCLA buildings" 
      });
      const fetchedMarkers = response.data.map(location => ({
        lat: parseFloat(location.location_lattitude),
        lng: parseFloat(location.location_longitude)
      }));
      setMarkers(
        fetchedMarkers
      );
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGetLocByPos = async (lng, lat) => {
    try {
      const response = await axios.post("http://localhost:5001/v1/get-location-by-pos", {
        lng: lng,
        lat: lat
      });
      console.log("response: ", response.data[0].location_name)
      setSelectedLocation(response.data[0]);
      setActiveMarker({ lng, lat });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const handleClosePopup = () => {
    setSelectedLocation(null);
    setActiveMarker(null);
  };

  useEffect(() => {
    handleGetLocation();
  }, []);
  useEffect(() => {
    console.log("Updated markers: ", markers);
  }, [markers]);
  return (
    <div className="map-container">
      <button className = "enableButton" onClick={togglePlaceMarker}>
        {placeMarker ? "Disable Marker Placing" : "Enable Marker Placing"}
      </button>
      <APIProvider apiKey={GOOGLE_MAP_API}>
        <Map
          defaultZoom={16}
          defaultCenter={position}
          onClick={placeMarker ? handleMapClick : null}>
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              position={marker}
              onClick={() => handleGetLocByPos(marker.lng, marker.lat)}
              icon={activeMarker && activeMarker.lng === marker.lng && activeMarker.lat === marker.lat ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}
            ></Marker>
          ))}
        </Map>
      </APIProvider>
      {selectedLocation && (
        <div className="location-info">
          <button className="close-btn" onClick={handleClosePopup}>X</button>
          <h2>Location Information</h2>
          <p>Name: {selectedLocation.location_name}</p>
          <p>Category: {selectedLocation.location_category}</p>
          <p>User: {selectedLocation.user_name}</p>
          <p>Longitude: {selectedLocation.location_longitude}</p>
          <p>Latitude: {selectedLocation.location_lattitude}</p>
        </div>
      )}
    </div>
  );
}

export default CustomMap;