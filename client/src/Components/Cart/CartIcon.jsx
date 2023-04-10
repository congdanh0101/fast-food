import { Badge, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const CartIcon = ({ count }) => {
    return (
        <Badge count={count}>
            <Link to="/">
                <ShoppingCartOutlined style={{ fontSize: '3rem' }} />
            </Link>
        </Badge>
    )
}

export default CartIcon
