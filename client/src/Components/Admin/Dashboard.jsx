import { useContext, useEffect, useState } from 'react'
import CartContext from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Badge, Menu } from 'antd'
import ManageProductList from './ManageProductList'

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    }
}

const items = [
    getItem(
        'Product',
        'product'
        // <InfoCircleOutlined style={{ fontSize: '150%' }} />
    ),
    getItem(
        'Order',
        'order'
        // <LockOutlined style={{ fontSize: '150%' }} />
    ),
    getItem(
        'User',
        'user'
        // <PlusCircleOutlined style={{ fontSize: '150%' }} />
    ),
    getItem(
        'Category',
        'category'
        // <TransactionOutlined style={{ fontSize: '150%' }} />
    ),
]

const DashBoard = () => {
    const context = useContext(CartContext)
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    useEffect(() => {})

    return (
        <div>
            {items.length > 0 && (
                <Menu
                    items={items}
                    mode="horizontal"
                    defaultSelectedKeys={items[0]?.key}
                    style={{
                        fontSize: '100%',
                        fontWeight: 'bold',
                        marginTop: '2rem',
                    }}
                ></Menu>
            )}
            <ManageProductList />
        </div>
    )
}

export default DashBoard