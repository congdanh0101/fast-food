import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import { Button, Col, Row, notification } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { QuantityPicker } from 'react-qty-picker'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartContext from '../../context/CartContext'

const ProductDetail = () => {
    const { getCountItem } = useContext(CartContext)
    const [product, setProduct] = useState({})
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [items, setItems] = useState([])
    const id = useParams()

    const fetchDataProduct = async () => {
        const p = await request.get(`/product/${id.id}`)
        const data = p.data
        setProduct(data)
        setPrice(
            data['price'].toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
            })
        )
    }

    const handleAddToCart = (e) => {
        // debugger
        let item = { product: product, quantity: quantity }
        let existingItems = JSON.parse(localStorage.getItem('items')) || []
        // const prevItemsCount = parseInt(localStorage.getItem('itemsCount'))
        const isDuplicate = existingItems.find(
            (it) => it.product._id === item.product._id
        )
        // duplicate
        if (isDuplicate) {
            existingItems.forEach((it) =>
                it.product._id === item.product._id
                    ? (it.quantity += item.quantity)
                    : it.quantity
            )
            localStorage.setItem('items', JSON.stringify(existingItems))
            // const itemsLength = (
            //     JSON.parse(localStorage.getItem('items')) || []
            // ).length
            // localStorage.setItem('itemsCount', itemsLength)
            setItems(existingItems)
        } else {
            localStorage.setItem(
                'items',
                JSON.stringify([...existingItems, item])
            )
            // const itemsLength = (
            //     JSON.parse(localStorage.getItem('items')) || []
            // ).length
            // localStorage.setItem('itemsCount', itemsLength)
            // setItemsCount(itemsLength)
            getCountItem()
            setItems([...existingItems, item])
        }
        notification.success({
            message: 'Add to cart successfully',
            duration: 1,
        })
    }

    useEffect(() => {
        fetchDataProduct()

        return () => {
            console.log(`clean product by id`)
            setProduct({})
        }
    }, [id])

    return (
        <div style={{ marginTop: '5%' }}>
            <Row>
                <Col span={3}></Col>
                <Col span={11}>
                    <img src={product['img']} width={'70%'} height={'120%'} />
                </Col>
                <Col span={10} style={{ marginTop: '5%' }}>
                    <h1 style={{ fontSize: '3rem' }}>{product.name}</h1>
                    <h2 style={{ fontSize: '2.5rem', color: 'red' }}>
                        {price}
                    </h2>
                    <h3 style={{ fontSize: '1.75rem' }}>Thông tin sản phẩm</h3>
                    <div style={{ fontSize: '1.25rem' }}>
                        {ReactHtmlParser(product.description)}
                    </div>
                    <br />
                    <div>
                        <h2 style={{ fontSize: '2rem' }}>Số lượng</h2>
                        <br />
                        <QuantityPicker
                            onChange={(value) => setQuantity(value)}
                            min={1}
                            value={quantity}
                            max={99}
                            smooth
                        />
                    </div>
                    <div>
                        <Button
                            type="primary"
                            style={{ height: '5rem', fontSize: '1.5rem' }}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCartOutlined />
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ProductDetail
