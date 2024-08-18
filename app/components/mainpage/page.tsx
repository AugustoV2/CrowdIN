"use client";

import React, { useEffect, useState } from "react";
import Public from "./public";
import SidebarX from "./sidebar";
import GoogleMapComponent from "./maping"; // Ensure this path is correct based on your file structure

export default function MainPage() {
  const [urlParam, setUrlParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setUrlParam(searchParams.get("page"));
    }
  }, []);

  // Use the hook value to control rendering
  if (urlParam === "1") {
    return (
      <div>
        <Public />
      </div>
    );
  } else if (urlParam === "2") {
    return (
      <div>
        <p>hoioooo</p>
      </div>
    );
  } else if (urlParam === "3") {
    return (
      <div>
        <GoogleMapComponent />
      </div>
    );
  } else {
    return (
      <div>
        <SidebarX />
      </div>
    );
  }
}
