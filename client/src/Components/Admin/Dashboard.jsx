import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    DatasetComponent,
    LegendComponent,
} from 'echarts/components'
import {
    MenuFoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'
import {
    CanvasRenderer,
    // SVGRenderer,
} from 'echarts/renderers'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import request from '../../utils/axiosConfig'
import { Button, Col, Layout, Menu, Row, Spin, theme } from 'antd'

import OverallChart from './OverallChart'
import RevenueChart from './RevenueChart'
import ManageOrderList from './ManageOrderList'
import ManageUser from './ManageUser'
import ManageProductList from './ManageProductList'
import { useNavigate } from 'react-router-dom'
import ManageCategoryList from './ManageCategoryList'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    LineChart,
    CanvasRenderer,
    DatasetComponent,
    LegendComponent,
])
const { Header, Sider, Content } = Layout

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    }
}

const items = [
    getItem('Dashboard', 'dashboard'),
    getItem(
        'Đơn hàng',
        'order'
        // <LockOutlined style={{ fontSize: '150%' }} />
    ),
    getItem(
        'Sản phẩm',
        'product'
        // <InfoCircleOutlined style={{ fontSize: '150%' }} />
    ),

    getItem(
        'Khách hàng',
        'user'
        // <PlusCircleOutlined style={{ fontSize: '150%' }} />
    ),
    // getItem(
    //     'Category',
    //     'category'
    //     // <TransactionOutlined style={{ fontSize: '150%' }} />
    // ),
    getItem('Loại sản phẩm', 'category'),
]

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false)
    const [dataOverall, setDataOverall] = useState({})

    const [optionsChart, setOptionChart] = useState({})
    const [collapsed, setCollapsed] = useState(false)
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const [key, setKey] = useState('dashboard')
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    const getUser = () => {
        const currentUser = JSON.parse(localStorage.getItem('user'))
        if (currentUser) {
            setUser(currentUser)
        } else {
            navigate('/login')
        }
    }
    const fetchDataOverall = async () => {
        try {
            setLoading(true)
            const response = await request.get('/data/chart/visualize/overall')
            setLoading(false)
            setDataOverall(response.data)
            const opts = {
                legend: {
                    orient: 'horizontal',
                    right: 100,
                    top: 'center',
                },
                tooltip: { position: 'top' },

                xAxis: { type: 'category', data: Object.keys(response.data) },
                yAxis: {},
                series: [
                    {
                        type: 'bar',
                        data: Object.values(response.data),
                        color: ['#dd6b66', '#759aa0'],
                    },
                ],
            }
            console.log(opts)
            setOptionChart(opts)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUser()
        fetchDataOverall()

        return () => {
            setDataOverall({})
            setUser(null)
        }
    }, [])

    const option = {
        title: { text: 'haha' },
        legend: {},
        tooltip: { position: 'top' },
        dataset: {
            // Provide a set of data.
            source: [
                ['Matcha Latte', 43.3, 85.8, 93.7],
                ['Milk Tea', 83.1, 73.4, 55.1],
                ['Cheese Cocoa', 86.4, 65.2, 82.5],
                ['Walnut Brownie', 72.4, 53.9, 39.1],
            ],
            dimensions: ['product', '2015', '2016', '2017'],
        },
        // Declare an x-axis (category axis).
        // The category map the first column in the dataset by default.
        xAxis: { type: 'category' },
        // Declare a y-axis (value axis).
        yAxis: {},
        // Declare several 'bar' series,
        // every series will auto-map to each column by default.
        series: [{ type: 'line' }, { type: 'bar' }, { type: 'bar' }],
    }
    return (
        <div>
            {/* <Spin spinning={loading} size="large" tip="Loading...">
                <Row>
                    {Object.keys(dataOverall)?.map((item, index) => (
                        <Col span={5} offset={1} key={index}>
                            <div
                                style={{
                                    border: '1px solid',
                                    backgroundColor:'#FFE5B4',
                                    textAlign: 'center',
                                    width: '75%',
                                    boxShadow: '5px 7.5px #888888',
                                    marginTop: '5%',
                                    borderRadius: '30px',
                                }}
                            >
                                <h1 style={{left:0}}>{item}</h1>
                                <h1>{dataOverall[item]}</h1>
                            </div>
                        </Col>
                    ))}
                </Row>
                <ReactEChartsCore
                    echarts={echarts}
                    notMerge={true}
                    lazyUpdate={true}
                    option={optionsChart}
                />
            </Spin> */}
            {/* <OverallChart /> */}
            {/* <Row>
                <Col span={3} offset={1}></Col>
                <Col span={20}>
                    <RevenueChart />
                </Col>
            </Row> */}
            {/* <RevenueChart /> */}

            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={items[0]?.key}
                        items={items}
                        onClick={(e) => setKey(e.key)}
                        style={{ height: '100vh', fontSize: '150%' }}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                        }}
                    >
                        <Button
                            type="text"
                            icon={
                                collapsed ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )
                            }
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '1.5rem',
                                width: 48,
                                height: 48,
                            }}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                        }}
                    >
                        {key === 'dashboard' && <RevenueChart />}
                        {key === 'order' && <ManageOrderList />}
                        {key === 'product' && <ManageProductList />}
                        {key === 'user' && <ManageUser />}
                        {key === 'category' && <ManageCategoryList />}
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}

export default AdminDashboard
