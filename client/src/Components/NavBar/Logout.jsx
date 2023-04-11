import { Badge, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const LogoutIcon = () => {
    return (
        <Link to="/logout" style={{ fontSize: '1.5rem' }}>
            Đăng xuất
            <LogoutOutlined style={{ fontSize: '3rem' }} />
        </Link>
    )
}

export default LogoutIcon
