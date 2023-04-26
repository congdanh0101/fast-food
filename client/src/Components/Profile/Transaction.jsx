// import { Space, Table, Tag } from 'antd'
// import { useEffect, useState } from 'react'
// import axiosInstance from '../../utils/axiosInstance'
// import request from '../../utils/axiosConfig'

// const columns = [
//     {
//         title: 'Date',
//         dataIndex: 'dateOrder',
//         key: 'dateOrder',
//         render: (text) => <a>{text}</a>,
//     },
//     {
//         title: 'Age',
//         dataIndex: 'age',
//         key: 'age',
//     },
//     {
//         title: 'Address',
//         dataIndex: 'address',
//         key: 'address',
//     },
//     {
//         title: 'Tags',
//         key: 'tags',
//         dataIndex: 'tags',
//         render: (_, { tags }) => (
//             <>
//                 {tags.map((tag) => {
//                     let color = tag.length > 5 ? 'geekblue' : 'green'
//                     if (tag === 'loser') {
//                         color = 'volcano'
//                     }
//                     return (
//                         <Tag color={color} key={tag}>
//                             {tag.toUpperCase()}
//                         </Tag>
//                     )
//                 })}
//             </>
//         ),
//     },
//     {
//         title: 'Action',
//         key: 'action',
//         render: (_, record) => (
//             <Space size="middle">
//                 <a>Invite {record.name}</a>
//                 <a>Delete</a>
//             </Space>
//         ),
//     },
// ]
// const data = [

// ]
// const onShowSizeChange = (current, pageSize) => {
//     console.log(current, pageSize);
//   };
// const Transaction = () => {

//     const [orderList, setOrderList] = useState([])

//     const userID = localStorage.getItem('userID');

//     const fetchOrderByUser = async()=>{
//         try {
//             const response = await request.get(`/order/user=${userID}`)
//             setOrderList(response.data)
//         } catch (error) {
//             console.log(error);

//         }
//     }

//     useEffect(()=>{
//         fetchOrderByUser()

//         return()=>{
//             setOrderList([])
//         }

//     },[])

//     return (
//         <div>
//             <Table
//                 columns={columns}
//                 dataSource={data}
//                 pagination={{
//                     position: ['topRight'],
//                     showSizeChanger:true,
//                     responsive:true,
//                     defaultCurrent:1,
//                 }}
//             />
//         </div>
//     )
// }
// export default Transaction

import { DownOutlined } from '@ant-design/icons'
import { Badge, Dropdown, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'
import { Link, useNavigate } from 'react-router-dom'

const Transaction = () => {
    const userID = localStorage.getItem('userID')
    const [orderList, setOrderList] = useState([])
    const [orderData, setOrderData] = useState([])
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const vnpay = (e) => {
        const orderID = e.target.dataset.orderId
        try {
            console.log(orderID)

            // const response = request.post('/payment/create_payment_url', {
            //     orderID: orderID,
            // })
            const response = request
                .post('/payment/create_payment_url', {
                    orderID: orderID,
                })
                .then((res) => window.open(res.data.payment))
                .catch((err) => console.log(err))
            // window.open(response.data.payment, '_blank')
        } catch (error) {}
    }

    const fetchOrderByUser = async () => {
        try {
            const response = await request.get(`/order?user=${userID}`)
            console.log(response.data)

            let data = []
            // debugger
            for (let i = 0; i < response.data.length; i++) {
                const order = response.data[i]
                data.push({
                    key: order['_id'],
                    no: (i + 1).toString(),
                    date: new Date(order['dateOrder']).toLocaleDateString(),
                    time: new Date(order['dateOrder']).toLocaleTimeString(),
                    totalPrice: order['totalPrice'],
                    discount: order['discount'],
                    subTotal: order['subtotal'],
                    payment: order['payment'],
                    paid:
                        order['isPaid'] === true ? (
                            'Đã thanh toán'
                        ) : order['payment'] === 'Online' ? (
                            <a
                                href="#"
                                style={{ color: 'red', fontWeight: 'bold' }}
                                onClick={vnpay}
                                data-order-id={order['_id']}
                            >
                                Chưa thanh toán
                            </a>
                        ) : (
                            <p style={{ color: 'blue' }}>Chưa thanh toán</p>
                        ),
                    status: order['status'],
                })
            }
            console.log('data ', data)

            setOrderData(data)
            setOrderList(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    // const orderTableData = () => {
    //     let data = []
    //     for (let i = 0; i < orderList.length; i++) {
    //         data.push({
    //             key: i.toString(),
    //             no: (i + 1).toString(),
    //             date: new Date(orderList[i]['dateOrder']).toLocaleDateString(),
    //             totalPrice: orderList[i]['totalPrice'],
    //             discount: orderList[i]['discount'],
    //             subTotal: orderList[i]['subtotal'],
    //             payment: orderList[i]['payment'],
    //             paid: orderList[i]['isPaid'],
    //             status: orderList[i]['status'],
    //         })
    //     }
    //     setOrderData([...orderData, data])
    // }

    useEffect(() => {
        fetchOrderByUser()
        setLoading(false)
        return () => {
            setOrderList([])
            setOrderData([])
            setLoading(true)
        }
    }, [])
    // useEffect(() => {
    //     orderTableData()
    //     console.log('orderData ', orderData)
    // }, [orderList])

    const expandedRowRender = ({ OrderId }) => {
        const columns = [
            { title: '#', dataIndex: 'No', key: 'No' },
            {
                title: 'Product',
                dataIndex: 'product',
                key: 'product',
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
            },
            {
                title: 'Price',
                dataIndex: 'upgradeNum',
                key: 'upgradeNum',
            },
            {
                title: 'Total price',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
            },
        ]
        const data = []
        for (let i = 0; i < 3; ++i) {
            data.push({
                key: i.toString(),
                No: (i + 1).toString(),
                product: 'Ga gion ' + (i + 1).toString(),
                quantity: i + 1,
                upgradeNum: 'Upgraded: 56',
                totalPrice: '1',
            })
        }
        return (
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
            />
        )
    }
    const columns = [
        {
            title: '#',
            dataIndex: 'no',
        },
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Time',
            dataIndex: 'time',
        },
        {
            title: 'Total price',
            dataIndex: 'totalPrice',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
        },
        {
            title: 'Sub total',
            dataIndex: 'subTotal',
        },
        {
            title: 'Payment method',
            dataIndex: 'payment',
        },
        {
            title: 'Paid',
            dataIndex: 'paid',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => (
                <Badge
                    status={getStatusOrder(record.status)}
                    text={getTextStatusOrder(text)}
                />
            ),
        },
    ]

    const getStatusOrder = (status) => {
        if (
            status === 'Pending' ||
            status === 'Processing' ||
            status === 'Shipped'
        )
            return 'processing'
        if (status === 'Failed') return 'error'
        if (status === 'Succeeded') return 'success'
    }

    const getTextStatusOrder = (status) => {
        switch (status) {
            case 'Pending':
                return 'Đã tiếp nhận'
            case 'Processing':
                return 'Đang xử lý'
            case 'Shipped':
                return 'Đang giao hàng'
            case 'Failed':
                return 'Đơn hàng thất bại'
            default:
                return 'Đơn hàng thành công'
        }
    }

    // let data = []
    // for (let i = 0; i < 3; ++i) {
    //     data.push({
    //         key: i.toString(),
    //         no: (i + 1).toString(),
    //         date: 'Screen',
    //         totalPrice: 'iOS',
    //         discount: '10.3.4.5654',
    //         subTotal: 500,
    //         payment: 'Jack',
    //         paid: '2014-12-24 23:12:00',
    //         status: 'Processing',
    //     })
    // }

    const defaultTitle = () => <h1>Lịch sử giao dịch</h1>

    return (
        <>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender,
                    // defaultExpandedRowKeys: ['0'],
                }}
                dataSource={orderData}
                size="large"
                bordered
                pagination={{
                    // pageSize:10,
                    position: ['bottomRight'],
                    defaultPageSize: 2,
                }}
                // onRow={(e) => console.log('on row table ', e)}
                // onHeaderRow={(e) => console.log('on header row table ', e)}
                onExpand={(expanded, record) => {
                    const parentKey = record.key
                    console.log('parent key ', parentKey)
                }}
                title={defaultTitle}
            />
        </>
    )
}
export default Transaction
