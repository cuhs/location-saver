import "./App.css";
import React, { useState, useEffect } from "react";
import { AdvancedMarker, APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import axios from 'axios'

const CustomMap = () => {
  const position = { lat: 34.0722, lng: -118.4441 };
  const GOOGLE_MAP_API = 'some-api-key';
  const [placeMarker, setPlaceMarker] = useState(false);
  const [markers, setMarkers] = useState([]);


  
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
  

  useEffect(() => {
    handleGetLocation();
  }, []);
  useEffect(() => {
    console.log("Updated markers: ", markers);
  }, [markers]);
  return (
    <div className="map-container">
      <button onClick={togglePlaceMarker}>
        {placeMarker ? "Disable Marker Placing" : "Enable Marker Placing"}
      </button>
      <APIProvider apiKey={GOOGLE_MAP_API}>
        <Map
          defaultZoom={16}
          defaultCenter={position}
          onClick={placeMarker ? handleMapClick : null}>
          {markers.map((marker, index) => (
            <Marker key={index} position={marker}></Marker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

export default CustomMap;