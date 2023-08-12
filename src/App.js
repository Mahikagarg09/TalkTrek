import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register  from './Pages/Register';
import Home from './Pages/Home';
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <Home />
            }
          />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
