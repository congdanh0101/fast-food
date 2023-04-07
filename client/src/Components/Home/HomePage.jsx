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
    let items = []
    useEffect(() => {
        async function fetchDataCategory() {
            const listCategory = await request.get('/category')
            for (var x = 0; x < listCategory.data.length; x++) {
                items.push(
                    getItem(
                        listCategory.data[x]['name'],
                        listCategory.data[x]['_id']
                    )
                )
                console.log(items)
            }
            setCategory(listCategory.data)
        }
        fetchDataCategory()
        console.log(category)
    }, [])

    category.map((x) => getItem(x['_id'], x['name']))
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
                        defaultSelectedKeys={category[0]}
                        items={items}
                        mode="inline"
                        defaultOpenKeys={category[0]}
                        onClick={(e) => console.log(e)}
                    ></Menu>
                </Col>
                <Col span={1}></Col>

                <Col span={18}>
                    <Row gutter={[48, 24]}>
                        <Col span={6}>1</Col>
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
