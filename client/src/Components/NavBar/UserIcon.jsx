import { Badge, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const UserIcon = ({ user }) => {
    return (
        <Link to="/profile" style={{ fontSize: '1.5rem' }}>
            {user.fullName}
            <UserOutlined style={{ fontSize: '3rem' }} />
        </Link>
    )
}

export default UserIcon
