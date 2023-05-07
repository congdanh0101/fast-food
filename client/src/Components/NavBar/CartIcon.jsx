import { Badge, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartCountItemContext } from '../Product/ProductDetail'

const CartIcon = ({countItems}) => {

    const count = useContext(CartCountItemContext)

    const badgeQuantity = (JSON.parse(localStorage.getItem('items')) || [])
        .length
    return (
        <Link to="/cart">
            Giỏ hàng
            <Badge count={countItems}>
                <ShoppingCartOutlined style={{ fontSize: '3rem' }} />
            </Badge>
        </Link>
    )
}

export default CartIcon
