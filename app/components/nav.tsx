'use client';
import React from 'react'
import { IoReorderThreeOutline } from "react-icons/io5";
import Sidebar from './mainpage/sidebar';


const Navbar = () => {
    const [isClicked, setIsClicked] = React.useState(false);

    if (isClicked) {
        return (
            <div>
                
                <Sidebar />
                <div className="close-icon">
                    <button onClick={() => setIsClicked(false)}>Close</button>
                </div>
                
            </div>
        );
    }
    else{

    return (
        <div>
            <nav>
                


                <nav className="bg-black outline-none outline-gray-900 ">

                    <IoReorderThreeOutline className='text-5xl justify-start pt-3' onClick={() => { setIsClicked(true) }} />
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4">


                        <a href="./" className="space-x-3 rtl:space-x-reverse flex items-center">
                            <span className="text-3xl font-semibold whitespace-nowrap text-white">Blaaa</span>
                        </a>
                        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">

                        </button>
                        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                                <li>
                                    <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
                                </li>


                            </ul>
                        </div>
                    </div>
                </nav>

            </nav>


        </div>


    )
}

}
export default Navbar
