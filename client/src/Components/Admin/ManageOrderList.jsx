import {
    DownOutlined,
    CloseCircleFilled,
    CheckCircleFilled,
    CheckCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'
import {
    Badge,
    Button,
    Dropdown,
    Input,
    Popconfirm,
    Select,
    Space,
    Table,
    notification,
} from 'antd'
import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'
import { Link, useNavigate } from 'react-router-dom'
import ExpandOrderDetail from '../Profile/ExpandOrderDetail'
import axiosInstance from '../../utils/axiosInstance'
const currencyFormat = (price) => (
    <h4 style={{ color: 'red' }}>
        {price.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
        })}
    </h4>
)

const ManageOrderList = () => {
    const userID = localStorage.getItem('userID')
    const [orderList, setOrderList] = useState([])
    const [orderData, setOrderData] = useState([])
    const [user, setUser] = useState({})
    const [statusList, setStatusList] = useState([
        {
            text: 'Đã tiếp nhận',
            value: 'Pending',
        },
        {
            text: 'Đang xử lý',
            value: 'Processing',
        },
        {
            text: 'Đang giao hàng',
            value: 'Shipped',
        },
        {
            text: 'Đơn hàng thất bại',
            value: 'Failed',
        },
        {
            text: 'Đơn hàng thành công',
            value: 'Succeeded',
        },
    ])

    const [orderStatus, setOrderStatus] = useState()
    const [recordStatus, setRecordStatus] = useState()

    const navigate = useNavigate()

    const fetchOrderByUser = async () => {
        try {
            const response = await request.get(`/order`)
            console.log(response.data)

            let data = []
            for (let i = 0; i < response.data.length; i++) {
                const order = response.data[i]
                data.push({
                    key: order['_id'],
                    no: (i + 1).toString(),
                    date: new Date(order['dateOrder']).toLocaleDateString(),
                    time: new Date(order['dateOrder']).toLocaleTimeString(),
                    totalPrice: order['totalPrice'],
                    discount: -order['discount'],
                    subTotal: order['subtotal'],
                    feeShip: order['feeShip'] || 0,
                    vat: order['vat'] || 0,
                    payment: getTextPaymentMethod(order['payment']),
                    paid: order['isPaid'],
                    status: order['status'],
                    user: order?.user?.fullName || '',
                    phoneNumber: order.user?.phoneNumber || '',
                    add: order.user?.address?.add || '',
                    ward: order.user?.address?.ward?.name || '',
                    district: order.user?.address?.district?.name || '',
                })
            }
            setOrderData(data)
            setOrderList(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            title: () => <span style={{ fontWeight: 'bold' }}>#</span>,
            dataIndex: 'no',
            align: 'center',
            // sorter: (a, b) => a.no - b.no,
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
                    render: (value) => currencyFormat(value),
                    sorter: (a, b) => a.totalPrice - b.totalPrice,
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Chiết khấu</span>
                    ),
                    dataIndex: 'discount',
                    align: 'center',
                    render: (value) => currencyFormat(value),
                    sorter: (a, b) => a.discount - b.discount,
                },
                // {
                //     title: () => (
                //         <span style={{ fontWeight: 'bold' }}>
                //             Phí giao hàng
                //         </span>
                //     ),
                //     dataIndex: 'feeShip',
                //     align: 'center',
                //     render: (value) => currencyFormat(value),
                //     sorter: (a, b) => a.feeShip - b.feeShip,
                // },
                // {
                //     title: () => (
                //         <span style={{ fontWeight: 'bold' }}>Thuế VAT</span>
                //     ),
                //     dataIndex: 'vat',
                //     align: 'center',
                //     render: (value) => currencyFormat(value),
                //     sorter: (a, b) => a.vat - b.vat,
                // },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Phải trả</span>
                    ),
                    dataIndex: 'subTotal',
                    align: 'center',
                    render: (value) => currencyFormat(value),
                    sorter: (a, b) => a.subTotal - b.subTotal,
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

                    filters: [
                        {
                            text: 'Online',
                            value: 'Online',
                        },
                        {
                            text: 'COD',
                            value: 'COD',
                        },
                    ],
                    onFilter: (value, record) =>
                        record.payment.indexOf(value) === 0,
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            Kiểm tra thanh toán
                        </span>
                    ),
                    dataIndex: 'paid',
                    align: 'center',
                    render: (value) => getTextPaid(value),
                    filters: [
                        {
                            text: 'Chưa thanh toán',
                            value: false,
                        },
                        {
                            text: 'Đã thanh toán',
                            value: true,
                        },
                    ],
                    onFilter: (value, record) => record.paid === value,
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Liên hệ</span>,
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Khách hàng</span>
                    ),
                    dataIndex: 'user',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            Số điện thoại
                        </span>
                    ),
                    dataIndex: 'phoneNumber',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Địa điểm</span>
                    ),
                    dataIndex: 'address',
                    align: 'center',
                    children: [
                        {
                            title: () => (
                                <span style={{ fontWeight: 'bold' }}>
                                    Địa chỉ
                                </span>
                            ),
                            dataIndex: 'add',
                            align: 'center',
                        },
                        {
                            title: () => (
                                <span style={{ fontWeight: 'bold' }}>
                                    Phường
                                </span>
                            ),
                            dataIndex: 'ward',
                            align: 'center',
                        },
                        {
                            title: () => (
                                <span style={{ fontWeight: 'bold' }}>Quận</span>
                            ),
                            dataIndex: 'district',
                            align: 'center',
                        },
                    ],
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Hành dộng</span>,
            dataIndex: 'action',
            align: 'center',
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Trạng thái</span>
                    ),
                    dataIndex: 'status',
                    align: 'center',
                    render: (value, record) => (
                        <div>
                            {value === 'Failed' || value === 'Succeeded' ? (
                                <Badge
                                    status={getStatusOrder(value)}
                                    text={getTextStatusOrder(value)}
                                ></Badge>
                            ) : (
                                <Select
                                    style={{ width: '100%' }}
                                    defaultValue={value}
                                    onChange={(e) => {
                                        console.log(e)
                                        setOrderStatus(e)
                                        setRecordStatus(record.key)
                                    }}
                                >
                                    {statusList?.map((item) => (
                                        <Select.Option key={item.value}>
                                            {item.text}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </div>
                    ),
                    filters: statusList,
                    onFilter: (value, record) =>
                        record.status.indexOf(value) === 0,
                },
                {
                    title: () => <span style={{ fontWeight: 'bold' }}></span>,
                    dataIndex: 'action',
                    align: 'center',
                    render: (value, record) => (
                        <div>
                            {record.status === 'Failed' ||
                            record.status === 'Succeeded' ? (
                                <></>
                            ) : (
                                <Popconfirm
                                    title="Cập nhật đơn hàng"
                                    description="Hãy chắc chắn bạn muốn cập nhật"
                                    okText="Xác nhận"
                                    cancelText="Hủy bỏ"
                                    onConfirm={async (e) => {
                                        console.log(e)
                                        try {
                                            const body = {
                                                status: orderStatus,
                                                isPaid: record.paid,
                                            }
                                            if (orderStatus === 'Succeeded')
                                                body['isPaid'] = true
                                            const response =
                                                await axiosInstance.put(
                                                    `/order/${record.key}`,
                                                    body
                                                )
                                            const index = orderData.findIndex(
                                                (item) =>
                                                    item.key === record.key
                                            )
                                            orderData[index].status =
                                                response.data.status
                                            orderData[index].isPaid =
                                                response.data.isPaid
                                            notification.success({
                                                message:
                                                    'Update order successfully',
                                                duration: 2,
                                            })
                                            fetchOrderByUser()
                                        } catch (error) {
                                            notification.error({
                                                message: 'Update order failed',
                                                description:
                                                    error.response?.data
                                                        .message,
                                                duration: 2,
                                            })
                                            console.log(error)
                                        }
                                    }}
                                    okType="primary"
                                >
                                    <Button type="primary">Cập nhật</Button>
                                </Popconfirm>
                            )}
                        </div>
                    ),
                },
            ],
        },
    ]

    const getTextPaid = (isPaid) => {
        return isPaid === true ? (
            // 'Đã thanh toán'
            <div style={{ color: 'green' }}>
                <CheckCircleOutlined style={{ fontSize: '200%' }} />
                <br />
                <h4>Đã thanh toán</h4>
            </div>
        ) : (
            // <p>Chưa thanh toán</p>
            <div style={{ color: 'red' }}>
                <CloseCircleOutlined style={{ fontSize: '200%' }} />
                <br />
                <h4>Chưa thanh toán</h4>
            </div>
        )
    }

    const getTextPaymentMethod = (payment) => {
        switch (payment) {
            case 'Online':
                return 'Online'
            default:
                return 'COD - Tiền mặt'
        }
    }

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

    useEffect(() => {
        fetchOrderByUser()

        return () => {
            setOrderList([])
            setOrderData([])
        }
    }, [])
    const defaultTitle = () => <h1>Lịch sử giao dịch</h1>

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
                size="small"
                bordered
                pagination={{
                    position: ['topRight'],
                    defaultPageSize: 5,
                    defaultCurrent: 1,
                    hideOnSinglePage: true,
                }}
            />
        </>
    )
}

export default ManageOrderList
