import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
// import { getProductById } from '../../redux/apiRequest'
// import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { EyeOutlined,EditTwoTone  } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import axiosInstance from '../../utils/axiosInstance'
import CartContext from '../../context/CartContext'

const ProductCard = ({ item, width }) => {
    const context = useContext(CartContext)

    return (
        <Link to={`/product/${item['_id']}`}>
            <Card
                // style={{ width: '19rem' }}
                border="dark"
                bg="light"
                // onClick={handleCardClick}
                className="card-product"
            >
                <div className="image-container" style={{ width: `${width}%` }}>
                    <img src={item['img']} />
                </div>

                <Card.Body style={{ marginTop: 24 }}>
                    <div
                        className="view-sold"
                        style={{
                            fontSize: '150%',
                        }}
                    >
                        <div style={{ left: 0 }}>
                            <ShoppingCartOutlined />{' '}
                            {item['sold'] >= 1000
                                ? `${(item['sold'] / 1000).toFixed(2)}K`
                                : item['sold']}
                        </div>
                        <div style={{ right: 0 }}>
                            <EyeOutlined />{' '}
                            {item['view'] >= 1000
                                ? `${(item['view'] / 1000).toFixed(2)}K`
                                : item['view']}
                        </div>
                        {/* {context.isAdmin ? (
                            <div style={{ right: 0 }}>
                                <EditTwoTone />
                            </div>
                        ) : (
                            <></>
                        )} */}
                    </div>
                    <Card.Link
                        href="/product"
                        style={{ textDecoration: 'none' }}
                    >
                        <Card.Title>
                            <h2>{item['name']}</h2>
                        </Card.Title>
                    </Card.Link>
                    <Card.Text style={{ color: 'red' }}>
                        <h2>
                            {item['price'].toLocaleString('it-IT', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </h2>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    )
}

const ProductList = ({ category }) => {
    const isDesktop = useMediaQuery({
        minWidth: 1366,
        maxWidth: 1919,
    })
    const isMobile = useMediaQuery({
        minWidth: 360,
        maxWidth: 640,
    })
    const isTablet = useMediaQuery({
        minWidth: 641,
        maxWidth: 960,
    })
    const isLaptop = useMediaQuery({
        minWidth: 961,
        maxWidth: 1365,
    })
    const isBigScreen = useMediaQuery({ minWidth: 1920 })
    const [productList, setProductList] = useState([])
    const [categoryId, setCategoryId] = useState(category)
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

        return () => {
            console.log(`Clean product list `)
            setProductList([])
        }
    }, [categoryId])

    useEffect(() => {
        setCategoryId(category)

        return () => {
            setProductList([])
        }
    }, [category])

    const handleOnClickProduct = (e) => {
        console.log(e)
        setDetail(true)
    }

    return (
        <Row gutter={[40, 24]}>
            {isDesktop &&
                productList?.map((item) => (
                    <Col span={8}>
                        <ProductCard item={item} width={100} />
                    </Col>
                ))}
            {isBigScreen &&
                productList?.map((item) => (
                    <Col span={6}>
                        <ProductCard item={item} width={100} />
                    </Col>
                ))}
            {isTablet &&
                productList?.map((item) => (
                    <Col span={12}>
                        <ProductCard item={item} width={100} />
                    </Col>
                ))}
            {isLaptop &&
                productList?.map((item) => (
                    <Col span={8}>
                        <ProductCard item={item} width={110} />
                    </Col>
                ))}
            {isMobile &&
                productList?.map((item) => (
                    <Col span={24}>
                        <ProductCard item={item} width={90} />
                    </Col>
                ))}
        </Row>
    )
}

export default ProductList
