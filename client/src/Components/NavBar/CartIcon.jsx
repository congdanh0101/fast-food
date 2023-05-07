import { Badge, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartCountItemContext } from '../Product/ProductDetail'
import CartContext from '../../context/CartContext'

const CartIcon = () => {
    const count = useContext(CartContext)
    return (
        <Link to="/cart">
            Giỏ hàng
            <Badge count={count.count}>
                <ShoppingCartOutlined style={{ fontSize: '3rem' }} />
            </Badge>
        </Link>
    )
}

export default CartIcon
