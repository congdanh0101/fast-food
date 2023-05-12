import { Badge, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import CartContext from '../../context/CartContext'

const UserIcon = () => {
    const context = useContext(CartContext)
    return (
        <Link
            to={context.isAdmin ? '/' : '/profile'}
            style={{ fontSize: '1.5rem' }}
        >
            {context.isAdmin ? 'ADMIN' : context.user.fullName}
            <UserOutlined style={{ fontSize: '3rem' }} />
        </Link>
    )
}

export default UserIcon
