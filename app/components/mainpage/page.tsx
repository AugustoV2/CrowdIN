'use client'

import React from 'react'
import Public from './public'
import { useEffect, useState } from 'react';
import SidebarX from './sidebar';



export default function MainPage() {
  const [urlParam, setUrlParam] = useState<string | null>(null);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setUrlParam(searchParams.get('page'));
    }
  }, []);
  let a=0;
  
  if (urlParam === '1') {
     

          if (a >0) {
           
          
          } else {
            a=a+1;
            console.log(a);
             return (
               <div>
                 <Public />
               </div>
             );

          }
        }
       
    

   else if (urlParam === '2') {
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