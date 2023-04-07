// import { Card } from "antd";
import React, { Component, useEffect, useState } from 'react'
import { Card, Button, Row, Col, Container } from 'react-bootstrap'
import { getProductById } from '../../redux/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import { ShoppingCartOutlined } from '@ant-design/icons'
// import request from '../../utils/axiosConfig'

const Product = (props) => {
    const [product, setProduct] = useState({})
    const [price, setPrice] = useState(0)
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
            const p = await request.get('/product/64306f3736f26adf7ce9f0f6')
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

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Link href="/">
                <Card.Img
                    variant="top"
                    // src="http://localhost:2001/public/48218354716_6b13703983_o.jpg-1680891895623.jpeg"
                    src={product['img']}
                    
                />
            </Card.Link>
            <Card.Body>
                <Card.Link
                    href="/"
                    style={{ color: 'blue', textDecoration: 'none' }}
                >
                    <Card.Title>{product['name']}</Card.Title>
                </Card.Link>
                <Card.Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
