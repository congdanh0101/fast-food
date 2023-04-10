// import { Card } from "antd";
import React, { Component, useEffect, useState } from 'react'
import { Card, Button, Container, Form } from 'react-bootstrap'
import { getProductById } from '../../redux/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import { ShoppingCartOutlined } from '@ant-design/icons'
// import request from '../../utils/axiosConfig'
import ImageResizer from 'react-image-resizer'
import Product from './Product'
import { Col, Row } from 'antd'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProductDetail from './ProductDetail'

const ProductList = (props) => {
    const [productList, setProductList] = useState([])
    const [categoryId, setCategoryId] = useState(props.category)
    const [detail, setDetail] = useState(false)

    const fetchDataProductList = async () => {
        try {
            console.log(`category id ${categoryId}`)
            const response = await request.get(
                `/product?category=${categoryId}`
            )
            const listData = response.data
            setProductList(listData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDataProductList()
    }, [categoryId])

    useEffect(() => {
        setCategoryId(props.category)
    }, [props.category])

    const handleOnClickProduct = (e) => {
        console.log(e)
        setDetail(true)
    }

    return (
        <Row gutter={[48, 24]}>
            {productList?.map((item) => (
                <Col span={6}>
                    <Link to={`/product/${item['_id']}`}>
                        <Product id={item['_id']} />
                    </Link>
                </Col>
            ))}
        </Row>
    )
}

export default ProductList
