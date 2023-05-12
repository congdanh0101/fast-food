import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import { useSelector } from 'react-redux'
import { Badge } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartIcon from './CartIcon'
import { Button } from 'antd'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import HomeIcon from './HomeIcon'
import LogoutIcon from './Logout'
import LoginIcon from './LoginIcon'
import UserIcon from './UserIcon'
import CartContext from '../../context/CartContext'
const NavBar = () => {
    // const [user, setUSer] = useState(null)

    const context = useContext(CartContext)
    // console.log('context', context)

    // const user = JSON.parse(localStorage.getItem('user'))
    return (
        <nav className="navbar-container">
            <HomeIcon />
            {context.isAdmin ? <></> : <CartIcon />}
            {context.user ? (
                <>
                    <UserIcon />
                    <LogoutIcon />
                </>
            ) : (
                <>
                    <LoginIcon />
                </>
            )}
        </nav>
    )
}

export default NavBar
