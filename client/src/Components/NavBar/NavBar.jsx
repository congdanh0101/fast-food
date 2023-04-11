import { useEffect, useState } from 'react'
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
const NavBar = ({ itemsCount }) => {
    // const [user, setUSer] = useState(null)
    const badgeQuantity = (JSON.parse(localStorage.getItem('items')) || [])
        .length
    const user = useSelector((state) => state.auth.login.currentUser)
    console.log(user)
    const refreshToken = localStorage.getItem('refreshToken')
    return (
        <nav className="navbar-container">
            <HomeIcon />
            <CartIcon count={badgeQuantity} />
            {refreshToken ? (
                <>
                    <UserIcon user={JSON.parse(localStorage.getItem('user'))} />
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
