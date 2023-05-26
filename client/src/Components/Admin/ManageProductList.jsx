import { Badge, Button, Space, Spin, Switch, Table, notification } from 'antd'
import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'
import { EyeOutlined, EditTwoTone } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import CreateProduct from './CreateProduct'
import axiosInstance from '../../utils/axiosInstance'

const currencyFormat = (price) => (
    <h4 style={{ color: 'red' }}>
        {price.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
        })}
    </h4>
)

const ManageProductList = () => {
    const [listProduct, setListProduct] = useState([])
    const [listCategory, setListCategory] = useState([])
    const [filterCategory, setFilterCategory] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchListProduct = async () => {
        try {
            setLoading(true)

            const data = []
            const response = await request.get('/product')
            for (var i = 0; i < response.data.length; i++) {
                const product = response.data[i]
                data.push({
                    key: product['_id'],
                    no: (i + 1).toString(),
                    price: product['price'],
                    category: product['category']['name'],
                    product: product['name'],
                    soft: product['softDeleted'],
                })
            }
            setListProduct(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCategoryList = async () => {
        try {
            setLoading(true)

            const response = await request.get('/category')
            const filter = []
            for (var i = 0; i < response.data.length; i++) {
                filter.push({
                    text: response.data[i]['name'],
                    value: response.data[i]['name'],
                })
            }
            setFilterCategory(filter)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchListProduct()
        fetchCategoryList()
        return () => {
            setListProduct([])
            setFilterCategory([])
        }
    }, [])

    const handleSwitchChange = async (record, e) => {
        try {
            const response = await axiosInstance.put(
                `/product/soft/${record.key}`
            )
            notification.success({
                message: 'Edit user successfully',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Edit user failed',
                description: error.response?.data.message,
            })
        }
    }

    const columns = [
        {
            title: () => <span style={{ fontWeight: 'bold' }}>#</span>,
            dataIndex: 'no',
            align: 'center',
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Sản phẩm</span>,
            dataIndex: 'product',
            align: 'center',
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Đơn giá</span>,
            dataIndex: 'price',
            align: 'center',
            render: (value) => currencyFormat(value),
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: () => (
                <span style={{ fontWeight: 'bold' }}>Loại sản phẩm</span>
            ),
            dataIndex: 'category',
            align: 'center',
            filters: filterCategory,
            onFilter: (value, record) => record.category.indexOf(value) === 0,
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Chỉnh sửa</span>,
            align: 'center',
            render: (_, record) => (
                <EditTwoTone
                    onClick={() =>
                        navigate(`/admin/product/edit/${record.key}`)
                    }
                />
            ),
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}></span>,
            align: 'center',
            dataIndex: 'soft',
            render: (value, record) => (
                <Space>
                    <Switch
                        style={{ width: '100%' }}
                        checkedChildren="Hiện"
                        unCheckedChildren="Ẩn"
                        defaultChecked={!value}
                        onChange={(e) => handleSwitchChange(record, e)}
                    />
                </Space>
            ),
            // sorter: (a, b) => a.no - b.no,
        },
    ]
    const defaultTitle = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>Danh sách sản phẩm</h1>
            <Button
                size="large"
                type="primary"
                danger
                shape="round"
                ghost
                onClick={(e) => navigate('/admin/product/create')}
            >
                Thêm sản phẩm
            </Button>
        </div>
    )

    return (
        <div>
            <Spin spinning={loading} size="large" tip="Loading...">
                <Table
                    columns={columns}
                    title={defaultTitle}
                    dataSource={listProduct}
                    pagination={{
                        position: ['bottomRight'],
                        defaultPageSize: 10,
                        defaultCurrent: 1,
                        hideOnSinglePage: true,
                    }}
                    bordered
                />
            </Spin>
        </div>
    )
}

export default ManageProductList
