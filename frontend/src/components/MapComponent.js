import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Lollipop Icon
const lollipopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 50],
  iconAnchor: [17, 50],
});

// Sample Landmarks & Restaurants near locations
const nearbyPlaces = [
  { name: "Khaas Bagh", type: "Restaurant", coords: [26.2730, 73.0120] },
  { name: "Janta Sweet Home", type: "Restaurant", coords: [26.2965, 73.0225] },
  { name: "Clock Tower Market", type: "Landmark", coords: [26.2971, 73.0180] },
  { name: "On The Rocks", type: "Restaurant", coords: [26.2705, 73.0250] },
];

const locations = [
  { name: "Tekri Hill", coords: [26.2700, 73.0100] },
  { name: "Umaid Bhawan", coords: [26.2673, 73.0310] },
  { name: "Blue City", coords: [26.2978, 73.0200] },
  { name: "Mandore Garden", coords: [26.3510, 73.0551] },
  { name: "Pachetia Hill", coords: [26.2960, 73.0210] },
  { name: "Surpura Bandh", coords: [26.2850, 73.0450] },
  { name: "Toorji Ka Jhalra", coords: [26.2984, 73.0213] },
  { name: "Jaswant Thada", coords: [26.2992, 73.0265] },
  { name: "Mehrangarh fort", coords: [26.2981, 73.0182] },
  { name: "Panchkund Chattriya", coords: [26.3250, 73.0500] },
  { name: "Ghanta Ghar", coords: [26.2971, 73.0186] },
];

// Smooth Navigation Component
const SmoothNavigation = ({ destination }) => {
  const map = useMap();
  useEffect(() => {
    if (destination) {
      map.flyTo(destination, 14, { duration: 1.5 });
    }
  }, [destination, map]);
  return null;
};

const MapComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const placeName = params.get("name");

  const foundLocation = locations.find((loc) => loc.name.toLowerCase() === placeName?.toLowerCase());

  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
      () => setUserLocation(null)
    );
  }, []);

  // Estimated Travel Time Calculation
  const getTravelTime = (mode) => {
    if (!userLocation || !foundLocation) return "N/A";

    const R = 6371; // Radius of the Earth in km
    const lat1 = (userLocation[0] * Math.PI) / 180;
    const lat2 = (foundLocation.coords[0] * Math.PI) / 180;
    const dLat = lat2 - lat1;
    const dLon = ((foundLocation.coords[1] - userLocation[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    const speeds = {
      walking: 3, // km/h
      cycling: 15,
      driving: 14,
    };

    const time = (distance / speeds[mode]) * 60; // Convert to minutes
    return `${Math.round(time)} min`;
  };

  if (!foundLocation) return <h2>Location Not Found</h2>;

  return (
    <div>
      <h2>{foundLocation.name}</h2>

      <button onClick={() => navigate("/")} style={{ marginBottom: "10px", padding: "8px", cursor: "pointer" }}>
        ⬅ Back to Home
      </button>

      <MapContainer ref={mapRef} center={foundLocation.coords} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Smooth Navigation */}
        <SmoothNavigation destination={foundLocation.coords} />

        {/* Destination Marker */}
        <Marker position={foundLocation.coords} icon={lollipopIcon}>
          <Popup>{foundLocation.name}</Popup>
        </Marker>

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={lollipopIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Smooth Route from User to Destination */}
        {userLocation && <Polyline positions={[userLocation, foundLocation.coords]} color="blue" weight={5} opacity={0.7} />}

        {/* Nearby Places Markers */}
        {nearbyPlaces.map((place, index) => (
          <Marker key={index} position={place.coords} icon={lollipopIcon}>
            <Popup>{`${place.name} (${place.type})`}</Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Estimated Travel Time */}
      {userLocation && (
        <div style={{ marginTop: "10px" }}>
          <h3>Estimated Travel Time</h3>
          <p>🚶 Walking: {getTravelTime("walking")}</p>
          <p>🚴 Cycling: {getTravelTime("cycling")}</p>
          <p>🚗 Driving: {getTravelTime("driving")}</p>
        </div>
      )}

      {/* Nearby Landmarks & Restaurants */}
      <h3>Nearby Landmarks & Restaurants</h3>
      <ul>
        {nearbyPlaces.map((place, index) => (
          <li key={index}>
            {place.name} - <strong>{place.type}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapComponent;
