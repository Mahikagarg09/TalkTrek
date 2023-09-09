import React, { useEffect, useRef, useState } from 'react'
import Leftside from '../components/Leftside'
import RightSide from '../components/RightSide'

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Click occurred outside of the sidebar, so close it
        setSidebarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        ref={sidebarRef}
        className={`${sidebarVisible ? "translate-x-0" : "-translate-x-full"
          } sidebar md:-translate-x-0 bg-white  z-10 fixed top-0 h-screen w-full md:w-[400px]  cursor-pointer transform transition-transform duration-500 ease-in-out`}
      >
        <Leftside toggleSidebar={toggleSidebar}/>
      </div>
      <div className="md:ms-[400px]">
        <RightSide toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible}/>
      </div>
    </div>


  )
}
