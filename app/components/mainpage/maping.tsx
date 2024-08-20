"use client";

import React, { useState, useEffect, useRef } from "react";

const containerStyle: React.CSSProperties = {
  width: "1000px",
  height: "800px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

interface LocationData {
  lat: number;
  lng: number;
  radius: number; // Radius in meters
  title: string;
  description: string;
}

function CombinedComponent() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const loadGoogleMapsScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById("google-maps-script")) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCYNxPWtXTlus_0V6Ef3TkrHdJV3cB_0Y0`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Maps script"));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();
        if (mapContainerRef.current && typeof google !== "undefined") {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;

                if (mapContainerRef.current) {
                  map.current = new google.maps.Map(mapContainerRef.current, {
                    center: { lat: latitude, lng: longitude },
                    zoom: 12,
                  });

                  new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map.current,
                    title: "You are here",
                  });

                  setMapLoaded(true);
                }
              },
              (error) => {
                setLocationError("Failed to retrieve your location");
                console.error(error);
              }
            );
          } else {
            setLocationError("Geolocation is not supported by this browser.");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (mapLoaded && map.current) {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      circlesRef.current.forEach((circle) => circle.setMap(null));
      circlesRef.current = [];

      const locationData: LocationData[] = alerts.map((alert: any) => ({
        lat: alert.lat,
        lng: alert.lon,
        radius: alert.radius*100,
        title: alert.title,
        description: alert.message,
      }));

      locationData.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map.current,
          title: location.title,
        });

        const contentString = `
          <div id="content" style="color: black;">
            <h1 style="font-size: 1.5em; color: black;">${location.title}</h1>
            <h2 style="font-size: 1.2em; color: black;">${location.description}</h2>
          </div>`;
        const infoWindow = new google.maps.InfoWindow({
          content: contentString,
        });

        marker.addListener("click", () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          infoWindowRef.current = infoWindow;
          infoWindow.open(map.current, marker);
        });

        const circle = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map.current,
          center: { lat: location.lat, lng: location.lng },
          radius: location.radius,
        });

        markersRef.current.push(marker);
        circlesRef.current.push(circle);
      });
    }
  }, [alerts, mapLoaded]);

  useEffect(() => {
    const fetchAlertsStream = (url: string): EventSource => {
      return new EventSource(url);
    };

    const sse = fetchAlertsStream(
      "https://0ac5-117-239-78-56.ngrok-free.app/chat_web"
    );

    sse.onmessage = (event) => {
      try {
        const data = event.data;
        console.log("SSE Data:", data);
        const jsonString = data.replace(/^data:\s*/, "").replace("Im", "I").replace(/'/g, '"');
        console.log("JSON String:", jsonString);
        const dataObject = JSON.parse(jsonString);

        if (dataObject.alerts) {
          setAlerts(dataObject.alerts);
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
        setError("Error parsing data");
      }
    };

    sse.onerror = (event) => {
      console.error("SSE Error:", event);
      setError("Error with SSE connection");
      sse.close();
    };

    return () => {
      sse.close();
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Location Alerts Map</h1>
        <p className="text-gray-600">Displaying real-time location-based alerts</p>
      </header>

      <div ref={mapContainerRef} style={containerStyle} />

      {locationError && (
        <p className="mt-4 text-red-600 font-semibold">
          {locationError}
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600 font-semibold">
          {error}
        </p>
      )}

      {/* Uncomment the following section if you want to display alerts */}
      {/* <div className="mt-8">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div
              key={index}
              className="border border-red-600 text-red-600 p-4 mb-4 rounded"
            >
              <strong>{alert.title}</strong>: {alert.message}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No alerts to display</p>
        )}
      </div> */}
    </div>
  );
}

export default CombinedComponent;
