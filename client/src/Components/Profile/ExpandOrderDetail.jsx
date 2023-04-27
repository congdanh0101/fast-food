import { Table } from 'antd'
import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'

const ExpandOrderDetail = ({ OrderId }) => {
    // const [itemData,setItemData] =useState([])
    const [data, setData] = useState([])

    const fetchData = async () => {
        const response = await request.get(`/order/${OrderId}`)
        const items = response.data.items
        const record = []
        for (let i = 0; i < items.length; i++) {
            const product = items[i].product
            record.push({
                key: product['_id'],
                product: product['name'],
                quantity: items[i]['quantity'],
                price: currencyFormat(product['price']),
                totalPrice: currencyFormat(
                    product['price'] * items[i]['quantity']
                ),
            })
        }
        setData(record)
    }

    const currencyFormat = (price) => (
        <h4 style={{ color: 'red' }}>
            {price.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
            })}
        </h4>
    )

    useEffect(() => {
        fetchData()

        return () => {
            setData([])
        }
    }, [])

    const columns = [
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Sản phẩm</span>,
            dataIndex: 'product',
            align: 'center',
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Số lượng</span>,
            dataIndex: 'quantity',
            align: 'center',
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Đơn giá</span>,
            dataIndex: 'price',
            align: 'center',
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Thành tiền</span>,
            dataIndex: 'totalPrice',
            align: 'center',
        },
    ]
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered

            // rowClassName={(record) => record.parentId === expandedRowKey ? 'child-row':''}
            // childrenColumnName='items'
        />
    )
}

export default ExpandOrderDetail
