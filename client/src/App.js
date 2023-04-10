import './App.css'
import HomePage from './Components/Home/HomePage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import NavBar from './Components/NavBar/NavBar'
import { useState } from 'react'
import Email from './Components/EmailVerification/Email'
import RegisterForm from './Components/Register/Registry'
import Product from './Components/Product/Product'
import ProductList from './Components/Product/ProductList'
import ProductDetail from './Components/Product/ProductDetail'
import Cart from './Components/Cart/Cart'
// import './dist/output.css'
function App() {
    return (
        <Router>
            <NavBar></NavBar>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/verify/register" element={<Email />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route
                        path="/cart"
                        element={<Cart />}
                    />
                </Routes>
            </div>
        </Router>
    )
}

export default App
