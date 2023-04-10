import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import { useSelector } from 'react-redux'
import { Badge } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartIcon from '../Cart/CartIcon'
const NavBar = () => {

    // const [user, setUSer] = useState(null)
    const badgeQuantity = (JSON.parse(localStorage.getItem('items')) || [])
        .length
    const user = useSelector((state) => state.auth.login.currentUser)
    console.log(user)
    const refreshToken = localStorage.getItem('refreshToken')
    return (
        <nav className="navbar-container">
            <CartIcon count={badgeQuantity} />
            <Link to="/" className="navbar-home">
                {' '}
                Home{' '}
            </Link>
            {refreshToken != null ? (
                <>
                    <p className="navbar-user">
                        Hi, <span> {localStorage.getItem('userID')} </span>{' '}
                    </p>
                    <Link to="/logout" className="navbar-logout">
                        {' '}
                        Log out
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/login" className="navbar-login">
                        {' '}
                        Login{' '}
                    </Link>
                    <Link to="/register" className="navbar-register">
                        {' '}
                        Register
                    </Link>
                </>
            )}
        </nav>
    )
}

export default NavBar
