"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import NavBar from "@/components/navBar";

const DynamicMap = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function FarmPulse() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [soil, setSoil] = useState<any>(null);

  const WEATHER_API = "969319db1fb8e194b5d514f495cbdb5d"; // replace with your key

  // 1. Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    }
  }, []);

  // 2. Fetch weather + soil data
  useEffect(() => {
    if (!location) return;

    // Weather
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("Weather API error:", err));

    // Soil
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=soil_temperature_0_to_7cm,soil_moisture_0_to_7cm&timezone=auto`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Soil API response:", data); // ✅ debug log
        setSoil(data);
      })
      .catch((err) => console.error("Soil API error:", err));
  }, [location]);

  // ✅ Safely extract soil data
  const soilTemp = soil?.daily?.soil_temperature_0_to_7cm?.[0] ?? "N/A";
  const soilMoisture = soil?.daily?.soil_moisture_0_to_7cm?.[0] ?? "N/A";

  return (
    <>
    <NavBar />
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">FarmPulse Map</h1>

      {!location && <p>📍 Detecting your location...</p>}

      {location && <DynamicMap lat={location.lat} lon={location.lon} />}

      {weather && (
        <div className="bg-green-100 p-4 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-xl">🌦 Weather</h2>
          <p>Temperature: {weather?.main?.temp ?? "N/A"} °C</p>
          <p>Condition: {weather?.weather?.[0]?.description ?? "N/A"}</p>
        </div>
      )}

      {soil && (
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-xl">🌍 Soil Data</h2>
          <p>Soil Temperature: {soilTemp} °C</p>
          <p>Soil Moisture: {soilMoisture} m³/m³</p>
        </div>
      )}
    </div>
    </>
  );
}
