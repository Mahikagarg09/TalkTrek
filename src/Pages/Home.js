import React from 'react'
import Leftside from '../components/Leftside'
import RightSide from '../components/RightSide'

export default function Home({ setIsAuth }) {
  return (
    <div class=" flex">
      <nav class="w-1/3 flex-none ...">
        <Leftside/>
      </nav>
      <main class="flex-1 min-w-0 overflow-auto ...">
      <RightSide/>
      </main>
    </div>


  )
}
