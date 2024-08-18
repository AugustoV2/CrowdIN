"use client";

import React, { useState, useEffect, useRef } from "react";

// Define container style for the map
const containerStyle: React.CSSProperties = {
  width: "1000px",
  height: "600px",
};

// Define the interface for location data
interface LocationData {
  lat: number;
  lng: number;
  radius: number; // Radius in meters
  title: string;
  description: string;
}

const CombinedComponent: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Function to load the Google Maps API script
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

  // Initialize the map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();
        if (mapContainerRef.current && typeof google !== "undefined") {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Latitude:", latitude, "Longitude:", longitude);

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
  }, []); // Empty dependency array ensures this effect runs only once

  // Handle alerts and update markers on the map
  useEffect(() => {
    if (mapLoaded && map.current) {
      // Clear existing markers and circles
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      circlesRef.current.forEach((circle) => circle.setMap(null));
      circlesRef.current = [];

      const locationData: LocationData[] = alerts.map((alert: any) => ({
        lat: alert.lat,
        lng: alert.lon,
        radius: alert.radius,
        title: alert.title,
        description: alert.description || "",
      }));

      locationData.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map.current,
          title: location.title,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${location.title}</strong><br>${location.description}</div>`,
        });

        // Add event listeners to show/hide InfoWindow
        marker.addListener("mouseover", () => {
          console.log("Opening InfoWindow for marker:", location.title);
          infoWindow.open(map.current, marker);
        });

        marker.addListener("mouseout", () => {
          console.log("Closing InfoWindow for marker:", location.title);
          infoWindow.close();
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

  // Fetch alerts using SSE
  useEffect(() => {
    const fetchAlertsStream = (url: string): EventSource => {
      return new EventSource(url);
    };

    const sse = fetchAlertsStream(
      "https://412c-103-209-253-33.ngrok-free.app/chat_web"
    );

    sse.onmessage = (event) => {
      try {
        const data = event.data;

        // Remove the 'data: ' prefix and handle JSON parsing
        const jsonString = data.replace(/^data:\s*/, "").replace(/'/g, '"');

        // Convert the string to a JavaScript object
        console.log("Received data:", jsonString);
        const dataObject = JSON.parse(jsonString);
        console.log("Parsed data:", dataObject);

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

    // Clean up the SSE connection when the component unmounts
    return () => {
      sse.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        {/* Uncomment the following section if you want to display alerts */}
        {/* {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                border: "1px solid red",
                color: "red",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <strong>{alert.title}</strong>: {alert.message}
            </div>
          ))
        ) : (
          <p>No alerts to display</p>
        )} */}
      </div>
      <div ref={mapContainerRef} style={containerStyle} />
      {locationError && <p>{locationError}</p>}
    </div>
  );
};

export default CombinedComponent;
