import React, { useState } from 'react'
import { Badge, Button, List } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'

const Cart = ({ onClearCart, onRemoveItem }) => {
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem('items')) || []
    )

    const handleRemove = (e) => {
        const itemsClone = items.filter((item) => item !== e)
        localStorage.setItem('items', JSON.stringify(itemsClone))
        setItems(items.filter((item) => item !== e))
        window.location.reload()
    }

    return (
        <div>
            {/* <List
                dataSource={items}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button
                                type="dashed"
                                onClick={() => handleRemove(item)}
                            >
                                Remove
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={`Name ${item.product.name}`}
                            description={`Quantity: ${item.quantity}`}
                        />

                        <div>${item.product.price * item.quantity}</div>
                    </List.Item>
                )}
            />
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <Button onClick={onClearCart}>Clear Cart</Button>
            </div> */}
        </div>
    )
}

export default Cart
