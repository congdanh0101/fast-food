import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import { Button, Col, Row } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { QuantityPicker } from 'react-qty-picker'
import { ShoppingCartOutlined } from '@ant-design/icons'
const ProductDetail = () => {
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
        // localStorage.setItem('order', [])
        // const order = localStorage.getItem('order')
        const item = { product: product, quantity: quantity }
        setItems([...items, item])
        const existingItems = JSON.parse(localStorage.getItem('items')) || []
        // console.log('existing item: ', existingItems)
        localStorage.setItem('items', JSON.stringify([...existingItems, item]))
        window.location.reload()
    }

    useEffect(() => {
        fetchDataProduct()
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
                    <br />
                    <div style={{ fontSize: '1.5rem' }}>
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
