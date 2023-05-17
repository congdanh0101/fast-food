import { useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../redux/apiRequest'
import { useDispatch } from 'react-redux'
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
            <div className="login-title"> Đăng nhập</div>
            <form onSubmit={handleLogin}>
                <label>Tài khoản</label>
                <input
                    type="text"
                    placeholder="Nhập tài khoản"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Link to='/forgot'>Quên mật khẩu?</Link>

                <button type="submit"> Tiếp tục </button>
            </form>
            <div className="login-register"> Bạn chưa có tài khoản? </div>
            <Link className="login-register-link" to="/register">
                Đăng ký{' '}
            </Link>
        </section>
    )
}

export default Login
