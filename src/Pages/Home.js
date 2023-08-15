import React from 'react'
import Leftside from '../components/Leftside'
import RightSide from '../components/RightSide'

export default function Home({ setIsAuth }) {
  return (
    <div className=" flex">
      <nav className="w-1/3 flex-none ...">
        <Leftside/>
      </nav>
      <main className="flex-1 min-w-0 overflow-auto ...">
      <RightSide/>
      </main>
    </div>


  )
}
