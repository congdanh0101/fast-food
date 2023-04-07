// import "./home.css";
import { Col, Menu, Row } from 'antd'
import {
    AppstoreOutlined,
    ContainerOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'
import Product from '../Product/Product'
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
    const [category, setCategory] = useState({ loading: true, data: [] })

    const fetchCategoryList = async () => {
        setCategory({ ...category, loading: true })
        try {
            const cate = await request.get('/category')
            setCategory({ data: cate.data, loading: false })
        } catch (err) {
            setCategory({ ...category, loading: false })
        }
    }

    const fetchProductByCategoryList = async(categoryID) =>{

    }

    useEffect(() => {
        fetchCategoryList()
    }, [])
    let items = []
    category.data.forEach((x) => items.push(getItem(x['name'], x['_id'])))

    //DUMMY DATA
    const userData = [
        {
            username: 'anhduy1202',
        },
        {
            username: 'kelly1234',
        },
        {
            username: 'danny5678',
        },
        {
            username: 'kenny1122',
        },
        {
            username: 'jack1234',
        },
        {
            username: 'loi1202',
        },
        {
            username: 'nhinhi2009',
        },
        {
            username: 'kellynguyen1122',
        },
    ]
    return (
        <div style={{ marginTop: 50 }}>
            <Row>
                <Col span={1}></Col>
                <Col span={4} style={{ backgroundColor: '#1234' }}>
                    <Menu
                        defaultSelectedKeys={items[0]}
                        items={items}
                        onClick={(e) => console.log(e.key)}
                        defaultOpenKeys={items[0]}
                    ></Menu>
                </Col>
                <Col span={1}></Col>

                <Col span={18}>
                    <Row gutter={[48, 24]}>
                        <Col span={6}>
                          {/* <Product></Product> */}1
                        </Col>
                        <Col span={6}>2</Col>
                        <Col span={6}>3</Col>
                        <Col span={6}>4</Col>
                        <Col span={6}>5</Col>
                        <Col span={6}>6</Col>
                        <Col span={6}>7</Col>
                        <Col span={6}>8</Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage
