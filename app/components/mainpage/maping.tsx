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
  type: string; // Added type field
}

const CombinedComponent: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select Alert");

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
      script.onerror = () =>
        reject(new Error("Failed to load Google Maps script"));
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
      // Clear existing markers and circles
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      circlesRef.current.forEach((circle) => circle.setMap(null));
      circlesRef.current = [];

      // Filter alerts based on selected option
      const locationData: LocationData[] = alerts
        .filter(
          (alert: any) =>
            selectedOption === "Select Alert" || alert.type === selectedOption
        )
        .map((alert: any) => ({
          lat: alert.lat,
          lng: alert.lon,
          radius: alert.radius * 100,
          title: alert.title,
          description: alert.message,
          type: alert.type,
        }));

      // Create markers and circles for filtered alerts
      locationData.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map.current,
          title: location.title,
        });

        const contentString = `
          <div id="content" style="color: black;">
            <h1 style="font-size: 1.5em; color: black;">${location.type}</h1>
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
  }, [alerts, mapLoaded, selectedOption]); // Add selectedOption as a dependency

  useEffect(() => {
    const fetchAlertsStream = (url: string): EventSource => {
      return new EventSource(url);
    };

    const sse = fetchAlertsStream("https://3fc8ee11474726bc33447804115cb41f.serveo.net/chat_web");

    sse.onmessage = (event) => {
      try {
        const data = event.data;
        console.log("SSE Data:", data);
        const jsonString = data
          .replace(/^data:\s*/, "")
          .replace("I'm", "I")
          .replace(/'/g, '"');
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setDropdownVisible(false); // Close the dropdown after selection
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800 mt-5">
          Location Alerts Map
        </h1>
        <p className="text-gray-600">
          Displaying real-time location-based alerts
        </p>
      </header>

      <div className="relative inline-block mb-4">
        <button
          id="dropdownDefaultButton"
          onClick={toggleDropdown}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          {selectedOption}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {dropdownVisible && (
          <div
            id="dropdownHover"
            className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <a
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleOptionSelect("Animal Alert")}
                >
                  Animal Alert
                </a>
              </li>
              <li>
                <a
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleOptionSelect("Disaster Alert")}
                >
                  Disaster Alert
                </a>
              </li>
              <li>
                <a
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleOptionSelect("Accident Alert")}
                >
                  Accident Alert
                </a>
              </li>
              <li>
                <a
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleOptionSelect("Traffic Alert")}
                >
                  Traffic Alert
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center w-full max-w-screen-lg">
        {locationError ? (
          <div className="text-red-600">{locationError}</div>
        ) : (
          <div
            ref={mapContainerRef}
            style={containerStyle}
            className="rounded-lg overflow-hidden"
          />
        )}
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default CombinedComponent;
