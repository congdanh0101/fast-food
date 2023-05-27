// import "./home.css";
import { Col, Layout, Menu, Row, Spin } from 'antd'
import {
    AppstoreOutlined,
    ContainerOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'
// import Product from '../Product/Product'
import ProductList from '../Product/ProductList'
import Category from '../Category/Category'
import { useMediaQuery } from 'react-responsive'
import NavBar from '../NavBar/NavBar'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    }
}
const HomePage = () => {
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
        maxWidth: 1080,
    })
    const isLaptop = useMediaQuery({
        minWidth: 1081,
        maxWidth: 1365,
    })
    const isBigScreen = useMediaQuery({ minWidth: 1920 })
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState([])
    const [categoryID, setCategoryID] = useState('63f0aeadaf6df55e5fa4f50e')
    const fetchCategoryList = async () => {
        try {
            // setLoading(true)
            const cate = await request.get('/category')
            setCategoryID(cate.data[0]['_id'])
            setCategory(cate.data)
            // setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchCategoryList()
        return () => setCategory([])
    }, [])

    const handleCategoryOnclick = (e) => {
        const categoryID = e.key
        setCategoryID(categoryID)
    }

    let items = []
    category.forEach((x) => items.push(getItem(x['name'], x['_id'])))

    return (
        <div>
            <Spin spinning={loading} size="large" tip="Loading...">
                <div style={{ marginTop: 50 }}>
                    {(isDesktop || isBigScreen || isLaptop) && (
                        <Row>
                            <Col span={1}></Col>
                            <Col span={4}>
                                {isBigScreen && items.length > 0 && (
                                    <Menu
                                        className="menu-category"
                                        style={{
                                            fontSize: '200%',
                                            fontWeight: 'bold',
                                            margin: 'auto',
                                        }}
                                        defaultSelectedKeys={[items[0]?.key]}
                                        items={items}
                                        onClick={handleCategoryOnclick}
                                    ></Menu>
                                )}
                                {(isDesktop || isLaptop) &&
                                    items.length > 0 && (
                                        <Menu
                                            className="menu-category"
                                            style={{
                                                fontSize: '150%',
                                                fontWeight: 'bold',
                                                margin: 'auto',
                                            }}
                                            defaultSelectedKeys={[
                                                items[0]?.key,
                                            ]}
                                            items={items}
                                            onClick={handleCategoryOnclick}
                                        ></Menu>
                                    )}

                                {/* <Category /> */}
                            </Col>
                            <Col span={1}></Col>

                            <Col span={16}>
                                <ProductList category={categoryID} />
                            </Col>
                        </Row>
                    )}
                    {(isMobile || isTablet) && (
                        <div>
                            <Menu
                                className="menu-category"
                                style={{
                                    fontSize: '100%',
                                    fontWeight: 'bold',
                                    margin: 'auto',
                                }}
                                defaultSelectedKeys={[items[0]?.key]}
                                items={items}
                                onClick={handleCategoryOnclick}
                            ></Menu>
                            <br />
                            <br />
                            <div style={{ width: '90%' }}>
                                <ProductList category={categoryID} />
                            </div>
                        </div>
                    )}
                </div>
            </Spin>
            {/* <NavBar></NavBar> */}
        </div>
    )
}

export default HomePage
