import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    const navigate = useNavigate()
    // console.log('context', context)

    // const user = JSON.parse(localStorage.getItem('user'))
    return (
        <nav className="logo-content">
            {/* <a style={{ width: '8.5%' }}>
                <img
                    src="https://i.pinimg.com/474x/50/e9/b8/50e9b88bc4414ee161093b2c6e60d230.jpg"
                    // width={'10%'}
                    // height={'5%'}
                    style={{
                        position: 'initial',
                        left: 0,
                        cursor: 'pointer',
                        top: 0,
                    }}
                    onClick={(e) => navigate('/')}
                    alt="No image"
                />
                
            </a> */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignContent: 'center',
                }}
            >
                <img
                    src="https://i.pinimg.com/474x/50/e9/b8/50e9b88bc4414ee161093b2c6e60d230.jpg"
                    width={'20%'}
                    // height={'5%'}
                    style={{
                        position: 'initial',
                        left: 0,
                        cursor: 'pointer',
                        top: 0,
                    }}
                    onClick={(e) => navigate('/')}
                    alt="No image"
                />
                <Link to={'/'}>UTE Fast Food</Link>
            </div>
            <div className="navbar-container">
                {/* <HomeIcon /> */}
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
            </div>
        </nav>
    )
}

export default NavBar
