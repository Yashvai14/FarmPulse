"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent({ lat, lon }: { lat: number; lon: number }) {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
      <MapContainer center={[lat, lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={[lat, lon]} icon={markerIcon}>
          <Popup>
            📍 Your Farm Location <br /> Lat: {lat.toFixed(3)}, Lon: {lon.toFixed(3)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
