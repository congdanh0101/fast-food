// import { Card } from "antd";
import React, { useEffect, useState } from 'react'
import { Card, Modal, Button, Form } from 'react-bootstrap'
import request from '../../utils/axiosConfig'
import './Product.css'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'

const Product = (props) => {
    const [product, setProduct] = useState({})
    const [price, setPrice] = useState(0)
    const [detail, setDetail] = useState(false)
    const [showModal, setShowModal] = useState(false)
    // const product = await request.get('/product/64305ff736f26adf7ce9e608')
    // console.log(product)
    // const dispatch = useDispatch()
    // const navigate = useNavigate()
    // const product = request
    //     .get('/product/64305ff736f26adf7ce9e608')
    //     .then(function (response) {
    //         return response.data
    //     })
    //     .catch(function (error) {
    //         console.log(error)
    //     })
    // const p = product.then(function (data) {
    //     return data
    // })

    // console.log(p)
    useEffect(() => {
        async function fetchDataProduct() {
            // const p = await request.get('/product/64306f3736f26adf7ce9f0f6')
            const p = await request.get(`/product/${props.id}`)
            const data = p.data
            setProduct(data)
            setPrice(
                data['price'].toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                })
            )
        }
        fetchDataProduct()
    }, [props.id])

    const handleCardClick = () => {
        setShowModal(false)
        console.log('Danh')
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <Card
                style={{ width: '19rem' }}
                border="dark"
                bg="light"
                onClick={handleCardClick}
            >
                <div className="image-container">
                    <img src={product['img']} width={250} height={200} />
                </div>

                <Card.Body style={{ marginTop: 24 }}>
                    <div className="view-sold" style={{ fontSize: '150%' }}>
                        <div>
                            <ShoppingCartOutlined />{' '}
                            {product['sold'] >= 1000
                                ? `${(product['sold'] / 1000).toFixed(2)}K`
                                : product['sold']}
                        </div>
                        <div>
                            <EyeOutlined />{' '}
                            {product['view'] >= 1000
                                ? `${(product['view'] / 1000).toFixed(2)}K`
                                : product['view']}
                        </div>
                    </div>
                    <Card.Link
                        href="/product"
                        style={{ textDecoration: 'none' }}
                    >
                        <Card.Title>
                            <h2>{product['name']}</h2>
                        </Card.Title>
                    </Card.Link>
                    <Card.Text style={{ color: 'red' }}>
                        <h2>{price}</h2>
                    </Card.Text>
                </Card.Body>
            </Card>

            {/* <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={`hello`}
                            ></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal> */}
        </>
    )
}

export default Product
