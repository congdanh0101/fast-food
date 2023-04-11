import { Badge, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const CartIcon = ({ count }) => {
    return (
        <Link to="/cart">
                Giỏ hàng
            <Badge count={count}>
                <ShoppingCartOutlined style={{ fontSize: '3rem' }} />
            </Badge>
        </Link>
    )
}

export default CartIcon
