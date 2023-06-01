import { Badge, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useHistory, HistoryRouter } from 'react-router-dom'
import { notification } from 'antd'
import axiosInstance from '../../utils/axiosInstance'

const LogoutIcon = () => {
    const history = useNavigate()
    const handleLogout = async (e) => {
        try {
            const response = await axiosInstance.delete('/auth/logout')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            localStorage.removeItem('userID')
            console.log('logged out', response)
            notification.success({
                message: 'Đăng xuất thành công',
                duration: 2,
            })
            setTimeout(() => {
                history('/')
                window.location.reload()
            }, 500)
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Đăng xuất thất bại',
                description: error.response?.data.message,
                duration: 2,
            })
            localStorage.removeItem('user')
            localStorage.removeItem('userID')
            localStorage.removeItem('items')
            localStorage.removeItem('accessToken')
            window.location.reload()
        }
    }

    return (
        <Link to="/" style={{ fontSize: '1.5rem' }} onClick={handleLogout}>
            Đăng xuất
            <LogoutOutlined style={{ fontSize: '3rem' }} />
        </Link>
    )
}

export default LogoutIcon
