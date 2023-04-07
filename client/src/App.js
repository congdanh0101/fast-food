import './App.css'
import HomePage from './Components/Home/HomePage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import NavBar from './Components/NavBar/NavBar'
import { useState } from 'react'
import Email from './Components/EmailVerification/Email'
import RegisterForm from './Components/Register/Registry'

function App() {
    return (
        <Router>
            <NavBar />
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/verify/register" element={<Email />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
