import {React,useState,useEffect} from 'react'
import Register from './Pages/Register'
import './index.css'
import Login from './Pages/Login'
import Home from './Pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function App() {
  const[isAuth,setIsAuth]=useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.isAuth) {
      setIsAuth(true);
    }
  }, []);

  return (
    <>
      {isAuth ? (
        <Router>
          <Routes>
            <Route path="/chat" element={<Home setIsAuth={setIsAuth} />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Register setIsAuth={setIsAuth} />} />
            <Route path="login" element={<Login setIsAuth={setIsAuth} />} />
      </Routes>
    </Router>
      )}
    </>
  )
}
