import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SukhnaLake from "../assets/images/SukhnaLae.jpeg";
import TrampolinePark from "../assets/images/TrampolineHug.jpeg";

// Fix Leaflet icon issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 💖 Example memory locations
const memories = [
  {
    title: "Sukhna Walk",
    lat: 30.7421,
    lon: 76.8188,
    photo: SukhnaLake,
    description: "Our first walk together as couple 💋",
  },
  {
    title: "Trampoline Park",
    lat: 30.6238,
    lon: 76.8254,
    photo: TrampolinePark,
    description: "Jumping jhpakk together 🤸‍♀️",
  },
];

// Component to auto-fit bounds based on pins
const FitBounds = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((m) => [m.lat, m.lon]));
      map.fitBounds(bounds, { padding: [50, 50] }); // smooth zoom
    }
  }, [map, locations]);

  return null;
};

export default function TravelMap() {
  return (
    <div className="w-full h-screen rounded-xl overflow-hidden">
      <MapContainer
        center={[20.5937, 78.9629]} // Initial fallback center (India)
        zoom={4}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Auto-zoom to fit markers */}
        <FitBounds locations={memories} />

        {memories.map((place, idx) => (
          <Marker key={idx} position={[place.lat, place.lon]}>
            <Popup>
              <div className="w-48">
                <img
                  src={place.photo}
                  alt={place.title}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <h4 className="font-bold text-sm">{place.title}</h4>
                <p className="text-xs text-gray-600">{place.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
