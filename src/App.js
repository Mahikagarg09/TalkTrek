import React from 'react'
import Register from './Pages/Register'
import './index.css'
import Login from './Pages/Login'
import Home from './Pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
    </Routes>
    </BrowserRouter >
  )
}
