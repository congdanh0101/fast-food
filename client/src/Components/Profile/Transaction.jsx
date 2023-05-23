import {
    DownOutlined,
    CloseCircleFilled,
    CheckCircleFilled,
    CheckCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'
import { Badge, Dropdown, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'
import { Link, useNavigate } from 'react-router-dom'
import ExpandOrderDetail from './ExpandOrderDetail'

const Transaction = () => {
    const userID = localStorage.getItem('userID')
    const [orderList, setOrderList] = useState([])
    const [orderData, setOrderData] = useState([])
    const [user, setUser] = useState({})

    const navigate = useNavigate()

    const vnpay = (e) => {
        const orderID = e.target.dataset.orderId
        try {
            const response = request
                .post('/payment/create_payment_url', {
                    orderID: orderID,
                })
                .then((res) => {
                    window.location.href = res.data.payment
                    // window.open(res.data.payment, '_blank')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error)
        }
    }

    const fetchOrderByUser = async () => {
        try {
            const response = await request.get(`/order?user=${userID}`)
            console.log(response.data)

            let data = []
            for (let i = 0; i < response.data.length; i++) {
                const order = response.data[i]
                data.push({
                    key: order['_id'],
                    no: (i + 1).toString(),
                    date: new Date(order['dateOrder']).toLocaleDateString(),
                    time: new Date(order['dateOrder']).toLocaleTimeString(),
                    totalPrice: currencyFormat(order['totalPrice']),
                    discount: currencyFormat(-order['discount']),
                    subTotal: currencyFormat(order['subtotal']),
                    feeShip: currencyFormat(order['feeShip']),
                    vat: currencyFormat(order['vat']),
                    payment: getTextPaymentMethod(order['payment']),
                    paid:
                        order['isPaid'] === true ? (
                            // 'Đã thanh toán'
                            <div style={{ color: 'green' }}>
                                <CheckCircleOutlined
                                    style={{ fontSize: '200%' }}
                                />
                                <br />
                                <h4>Đã thanh toán</h4>
                            </div>
                        ) : order['payment'] === 'Online' ? (
                            <div style={{ color: 'red' }}>
                                {/* <p>Chưa thanh toán</p> */}
                                <CloseCircleOutlined
                                    style={{ fontSize: '200%' }}
                                />
                                <br />
                                <h4>
                                    Bấm{' '}
                                    <a
                                        href="#"
                                        style={{
                                            fontWeight: 'bold',
                                            color: 'blue',
                                        }}
                                        onClick={vnpay}
                                        data-order-id={order['_id']}
                                    >
                                        vào đây
                                    </a>{' '}
                                    để thanh toán
                                </h4>
                            </div>
                        ) : (
                            // <p>Chưa thanh toán</p>
                            <div style={{ color: 'red' }}>
                                <CloseCircleOutlined
                                    style={{ fontSize: '200%' }}
                                />
                                <br />
                                <h4>Chưa thanh toán</h4>
                            </div>
                        ),
                    status: order['status'],
                })
            }
            setOrderData(data)
            setOrderList(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchOrderByUser()

        return () => {
            setOrderList([])
            setOrderData([])
        }
    }, [])

    const columns = [
        {
            title: () => <span style={{ fontWeight: 'bold' }}>#</span>,
            dataIndex: 'no',
            align: 'center',
        },
        {
            title: () => (
                <span style={{ fontWeight: 'bold' }}>Thời gian đặt hàng</span>
            ),
            dataIndex: 'datetime',
            align: 'center',
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Ngày</span>
                    ),
                    dataIndex: 'date',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Giờ</span>
                    ),
                    dataIndex: 'time',
                    align: 'center',
                },
            ],
        },
        // {
        //     title: 'Time',
        //     dataIndex: 'time',
        //     align: 'center',
        // },
        {
            title: () => (
                <span style={{ fontWeight: 'bold' }}>Giá trị đơn hàng</span>
            ),
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Tổng tiền</span>
                    ),
                    dataIndex: 'totalPrice',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Chiết khấu</span>
                    ),
                    dataIndex: 'discount',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            Phí giao hàng
                        </span>
                    ),
                    dataIndex: 'feeShip',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Thuế VAT</span>
                    ),
                    dataIndex: 'vat',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Phải trả</span>
                    ),
                    dataIndex: 'subTotal',
                    align: 'center',
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Thanh toán</span>,
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Phương thức</span>
                    ),
                    dataIndex: 'payment',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            Kiểm tra thanh toán
                        </span>
                    ),
                    dataIndex: 'paid',
                    align: 'center',
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Status</span>,
            dataIndex: 'status',
            align: 'center',
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

    const getTextPaymentMethod = (payment) => {
        switch (payment) {
            case 'Online':
                return 'Online'
            default:
                return 'COD - Tiền mặt'
        }
    }

    const currencyFormat = (price) => (
        <h4 style={{ color: 'red' }}>
            {price.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
            })}
        </h4>
    )

    const defaultTitle = () => <h1>Lịch sử giao dịch</h1>
    const defaultFooter = () => (
        <span>
            Nếu đơn hàng chưa thanh toán bằng hình thức online mà chưa thanh
            toán, vui lòng bấm vào "Online" để thanh toán
        </span>
    )
    return (
        <>
            <Table
                title={defaultTitle}
                // footer={defaultFooter}
                columns={columns}
                expandable={{
                    // expandRowByClick: true,
                    expandedRowRender: (record) => (
                        <ExpandOrderDetail OrderId={record.key} />
                    ),
                }}
                dataSource={orderData}
                // size="small"
                bordered
                pagination={{
                    position: ['bottomRight'],
                    defaultPageSize: 5,
                    defaultCurrent: 1,
                    hideOnSinglePage: true,
                }}
            />
        </>
    )
}
export default Transaction
