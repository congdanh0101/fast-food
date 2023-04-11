import { Badge, Button } from 'antd'
import { LoginOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginIcon = () => {
    return (
        <Link to="/login" style={{ fontSize: '1.5rem' }}>
            Đăng nhập
            <LoginOutlined  style={{ fontSize: '3rem',}} />
        </Link>
    )
}

export default LoginIcon
