import React from 'react'
import { Badge, Button, List } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'

const Cart = ({ onClearCart, onRemoveItem }) => {
    const items = JSON.parse(localStorage.getItem('items'))

    const handleRemove = (e) =>{
        
    }

    return (
        <div>
            <List
                dataSource={items}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button
                                type="link"
                                onClick={() => onRemoveItem(item)}
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
            </div>
        </div>
    )
}

export default Cart
