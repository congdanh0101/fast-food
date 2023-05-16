import { Badge, Button, Table } from 'antd'
import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'
import { EyeOutlined, EditTwoTone } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import CreateProduct from './CreateProduct'

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

    const navigate = useNavigate()

    const fetchListProduct = async () => {
        try {
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
                })
            }
            setListProduct(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCategoryList = async () => {
        try {
            const response = await request.get('/category')
            const filter = []
            for (var i = 0; i < response.data.length; i++) {
                filter.push({
                    text: response.data[i]['name'],
                    value: response.data[i]['name'],
                })
            }
            setFilterCategory(filter)
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
                Them san pham
            </Button>
        </div>
    )

    return (
        <div>
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
        </div>
    )
}

export default ManageProductList
