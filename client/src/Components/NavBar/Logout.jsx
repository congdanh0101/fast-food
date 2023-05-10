import { Badge, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useHistory, HistoryRouter } from 'react-router-dom'
import { notification } from 'antd'

const LogoutIcon = () => {
    const history = useNavigate()
    const handleLogout = (e) => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        notification.success({
            message: 'Logout successfully',
            duration: 2,
        })
        setTimeout(() => {
            history('/')
            window.location.reload()
        }, 500)
    }

    return (
        <Link to="/" style={{ fontSize: '1.5rem' }} onClick={handleLogout}>
            Đăng xuất
            <LogoutOutlined style={{ fontSize: '3rem' }} />
        </Link>
    )
}

export default LogoutIcon
