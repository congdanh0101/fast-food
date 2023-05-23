import './App.css'
import HomePage from './Components/Home/HomePage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import NavBar from './Components/NavBar/NavBar'
import { createContext, useContext, useEffect, useState } from 'react'
import Email from './Components/EmailVerification/Email'
import RegisterForm from './Components/Register/Registry'
import Product from './Components/Product/Product'
import ProductList from './Components/Product/ProductList'
import ProductDetail from './Components/Product/ProductDetail'
import Cart from './Components/Cart/Cart'
import Page from './Components/Cart/CartClone'
import UserProfile from './Components/Profile/UserProfile'
import Logout from './Components/Logout/Logout'
import ForgotPassword from './Components/ForgotPassword/ForgotPassword'
import Checkout from './Components/Checkout/Checkout'
import CartContext, { NavbarProvider } from './context/CartContext'
import NotFound from './Components/Error/NotFound'
import PaymentFailure from './Components/PaymentStatus/PaymentFailure'
import PaymentSuccess from './Components/PaymentStatus/PaymentSuccess'
import AdminManagement from './Components/Admin/Management'
import EditProduct from './Components/Admin/EditProduct'
import UserInfo from './Components/Profile/UserInfo'
import Reward from './Components/Profile/Reward'
import Transaction from './Components/Profile/Transaction'
import Security from './Components/Profile/Security'
import CreateProduct from './Components/Admin/CreateProduct'
import AdminDashboard from './Components/Admin/Dashboard'
import OrderSuccessfully from './Components/PaymentStatus/OrderSuccessfully'
// import './dist/output.css'

function App() {
    return (
        <Router>
            <NavbarProvider>
                <NavBar />
                <div className="App">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/verify/register" element={<Email />} />
                        <Route path="/verify/forgot" element={<Email />} />
                        <Route
                            path="/product/:id"
                            element={<ProductDetail />}
                        />
                        <Route path="/cart" element={<Page />} />
                        {/* <Route path="/logout" element={<Logout />} /> */}
                        <Route path="/profile" element={<UserProfile />} />
                        {/* <Route path="/profile/info" element={<UserInfo />} />
                        <Route path="/profile/reward" element={<Reward />} />
                        <Route
                            path="/profile/transactions"
                            element={<Transaction />}
                        />
                        <Route
                            path="/profile/security"
                            element={<Security />}
                        /> */}
                        <Route path="/forgot" element={<ForgotPassword />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route
                            path="/payment/failure"
                            element={<PaymentFailure />}
                        />
                        <Route
                            path="/order/success"
                            element={<OrderSuccessfully />}
                        />
                        <Route
                            path="/payment/success"
                            element={<PaymentSuccess />}
                        />
                        <Route
                            path="/admin/management"
                            element={<AdminManagement />}
                        />
                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/product/edit/:id"
                            element={<EditProduct />}
                        />

                        <Route
                            path="/admin/product/create"
                            element={<CreateProduct />}
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </NavbarProvider>
        </Router>
    )
}

export default App
