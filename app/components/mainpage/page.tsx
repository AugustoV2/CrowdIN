"use client";

import React, { useEffect, useState } from "react";
import Public from "./public";
import SidebarX from "./sidebar";
import Chat from "./chat";
import StaffApproval from "../../admin/approval";
import CombinedComponent from "./maping"; 

export default function MainPage() {
  const [urlParam, setUrlParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setUrlParam(searchParams.get("page"));
    }
  }, []);

  
  if (urlParam === "1") {
    return (
      <div>
        <Public />
      </div>
    );
  } else if (urlParam === "2") {
    return (
      <div>
        <Chat/>
        </div>
    );
  }
  else if (urlParam === '3') {
    return (
      <div>
        <StaffApproval/>
      </div>
    );
  } else if (urlParam === "4") {
    return (
      <div>
        <CombinedComponent />
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
