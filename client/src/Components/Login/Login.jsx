import { useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../redux/apiRequest'
import { useDispatch } from 'react-redux'
import Notification from '../Message/Notification'
import request from '../../utils/axiosConfig'
import { notification } from 'antd'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // console.log(`username: ${username}`);
    // console.log(`password ${password}`);

    const handleLogin = async (e) => {
        e.preventDefault()
        const userLogin = {
            username: username,
            password: password,
        }
        console.log(userLogin)
        loginUser(userLogin,dispatch,navigate)
    }

    return (
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit={handleLogin}>
                <label>USERNAME</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>PASSWORD</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit"> Continue </button>
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">
                Register one for free{' '}
            </Link>
        </section>
    )
}

export default Login
