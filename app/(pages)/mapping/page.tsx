'use client';

import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import NavBar from '@/components/navBar';

export default function GeoMappingPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Fix Leaflet marker icon loading issue
  useEffect(() => {
    // Fix Leaflet marker icon loading issue
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    });

    // Auto-detect user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to detect your location. Using default.');
          setUserLocation([21.1458, 79.0882]); // fallback location
        }
      );
    } else {
      alert('Geolocation not supported by your browser.');
      setUserLocation([21.1458, 79.0882]); // fallback location
    }
  }, []);

  // Mock productivity zones (in a real app, you’ll load dynamically)
  const zones = [
    {
      name: 'Zone A',
      productivity: 'High',
      color: 'green',
      coords: [
        [21.1458, 79.0882],
        [21.1455, 79.0910],
        [21.1432, 79.0910],
        [21.1432, 79.0882],
      ],
    },
    {
      name: 'Zone B',
      productivity: 'Moderate',
      color: 'orange',
      coords: [
        [21.1430, 79.0870],
        [21.1430, 79.0850],
        [21.1410, 79.0850],
        [21.1410, 79.0870],
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
        <NavBar />
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center py-12">
        <h1 className="text-4xl font-bold text-green-800">Geo-Mapping for Farmland</h1>
        <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
          Visualize your farm with map integration and track productivity zone-wise.
        </p>
      </section>

      {/* Map Section */}
      <section className="max-w-6xl mx-auto h-[500px] rounded-lg overflow-hidden shadow-lg">
        {userLocation && (
          <MapContainer
            center={userLocation}
            zoom={15}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* User location marker */}
            <Marker position={userLocation}>
              <Popup>
                📍 You are here <br />
                Fertility: <strong>{Math.floor(Math.random() * 60) + 40}%</strong>
              </Popup>
            </Marker>
            {zones.map((zone, idx) => (
              <Polygon
                key={idx}
                pathOptions={{ color: zone.color, fillOpacity: 0.5 }}
                positions={zone.coords as [number, number][]}
              >
                <Popup>
                  <strong>{zone.name}</strong>
                  <br />
                  Productivity: {zone.productivity}
                </Popup>
              </Polygon>
            ))}
          </MapContainer>
        )}

        {!userLocation && (
          <div className="flex justify-center items-center h-full text-gray-500">Detecting your location...</div>
        )}
      </section>
    </main>
  );
}
