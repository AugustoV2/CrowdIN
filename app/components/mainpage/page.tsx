"use client";

import React from "react";
import Public from "./public";
import { useEffect, useState } from "react";
import SidebarX from "./sidebar";

// Define the props interface matching the expected props
interface MainPageProps {
  value: string; // The prop that is passed to MainPage
}


export default function MainPage() {
  const [urlParam, setUrlParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setUrlParam(searchParams.get("page"));
    }
  }, []);

  // Use the hook value to control rendering
  if ( urlParam === '1') {
    return (
      <div>
        <Public />
      </div>
    );
  } else if (urlParam === '2') {
    return (
      <div>
      {/* <Debngui/> */}
      </div>
    );
  }

  else {
    return (
      <div>
        <SidebarX />
      </div>
    );
  }
}
