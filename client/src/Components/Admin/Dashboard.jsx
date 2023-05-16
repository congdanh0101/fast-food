import { useContext, useEffect, useState } from 'react'
import CartContext from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Badge, Menu } from 'antd'
import ManageProductList from './ManageProductList'
import ManageOrderList from './ManageOrderList'
import ManageUser from './ManageUser'

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
        'Order',
        'order'
        // <LockOutlined style={{ fontSize: '150%' }} />
    ),
    getItem(
        'Product',
        'product'
        // <InfoCircleOutlined style={{ fontSize: '150%' }} />
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
    const [key, setKey] = useState('order')

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
                    onClick={(e) => setKey(e.key)}
                ></Menu>
            )}
            {/* <ManageProductList /> */}
            {key === 'order' && <ManageOrderList />}
            {key === 'product' && <ManageProductList />}
            {key === 'user' && <ManageUser />}
        </div>
    )
}

export default DashBoard
