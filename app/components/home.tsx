'use client';
import React from 'react'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';
import Login from './page'
import { useRouter } from 'next/navigation';



const Home = () => {  
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('./components'); // Navigate to the /login page
  };


  return (
    <div>
      <section>
        <div className='grid grid-cols-1 lg:grid-cols-12 ml-20 mt-20' >
          <div className='col-span-7 '>
            <div className='ml-0 mx-auto '>
              <h1 className=' mb-10 mt-10 lg:text-6xl font-extrabold  bg-gradient-to-r from-indigo-400 to-red-600 inline-block text-transparent bg-clip-text'>

                Welcome,
              </h1>
              <h2>
                <TypeAnimation
                  sequence={[

                    'Citize Alert',
                    2000,

                    'CrowdIN',
                    1000,
                    'friewnd',
                    1000,
                    'AAAAAAA',
                    1000
                  ]}
                  wrapper="span"
                  speed={50}
                  style={{ fontSize: '2em', display: 'inline-block' }}
                  repeat={Infinity}
                /></h2>

            </div>


            <p className='mb-8 text-gray-500'>
            You are Crowdin AI, an InApp assistant for the app named 'Crowdin', The app is a Crowd Alert App which alerts the users about nearby traffic related issues, and animal attacks reported, the primary source of data is the users itself, so be like the ai for tha pp and assist users needs, dont answer out of scope questions, also provide disaster relief information, and help users with their account related issues, also no support for markdown formattings.
            </p>

          </div>

          <div className='col-span-5 mt-200'>

            <div className=' '>
              <img
                src="https://envs.sh/iB1.png"
                alt="nothng"
                width={500}
                height={500} />
            </div>
          </div>
          <div className='ml-100 mt-10'>
            <button
              onClick={handleLoginClick}
              className='px-10 py-3 rounded-full bg-white text-black'
            >
              Signin
            </button>
          </div>
          <div className='ml-100 mt-10'>
            <button

              className='px-4  py-3 rounded-full ml-20 bg-white text-black'
              type='button'
            >

              DownladAPP
            </button>
          </div>

        </div>
      </section>


    </div>
  )
}

export default Home



