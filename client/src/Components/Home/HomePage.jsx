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
import ProductList from '../Product/ProductList'
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
    const [category, setCategory] = useState([])
    const [categoryID, setCategoryID] = useState('63f0add10207afdbe49f43ea')
    const fetchCategoryList = async () => {
        try {
            const cate = await request.get('/category')
            // localStorage.getItem('categoryID')
            //     ? setCategory(null)
            //     : setCategoryID(cate.data[0]['_id'])
            setCategoryID(cate.data[0]['_id'])
            setCategory(cate.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchCategoryList()
    }, [])

    const handleCategoryOnclick = (e) => {
        const categoryID = e.key
        setCategoryID(categoryID)
    }

    let items = []
    category.forEach((x) => items.push(getItem(x['name'], x['_id'])))

    return (
        <div style={{ marginTop: 50 }}>
            <Row>
                <Col span={1}></Col>
                <Col span={4}>
                    {items.length > 0 ? (
                        <Menu
                            style={{
                                fontSize: '200%',
                                fontWeight: 'bold',
                                margin: 'auto',
                            }}
                            defaultSelectedKeys={[items[0]?.key]}
                            items={items}
                            onClick={handleCategoryOnclick}
                        ></Menu>
                    ) : (
                        <></>
                    )}
                </Col>
                <Col span={1}></Col>

                <Col span={18}>
                    <ProductList category={categoryID} />
                </Col>
            </Row>
        </div>
    )
}

export default HomePage
