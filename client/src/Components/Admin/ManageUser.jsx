import { Space, Spin, Switch, Table, notification } from 'antd'
import { useState } from 'react'
import request from '../../utils/axiosConfig'
import { useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'

const ManageUser = () => {
    const [listUser, setListUser] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchUser = async () => {
        try {
            setLoading(true)
            const response = await request.get('/user')

            let data = []

            for (var i = 0; i < response.data.length; i++) {
                const user = response.data[i]
                if (user['roles'].includes('ADMIN')) continue
                data.push({
                    key: user['_id'],
                    no: i + 1,
                    name: user['fullName'],
                    phoneNumber: user['phoneNumber'],
                    email: user['email'],
                    rank: user['rank'],
                    rankingPoint: user['rankingPoint'].toFixed(2),
                    address: user?.address?.add,
                    ward: user?.address?.ward?.name,
                    district: user?.address?.district?.name,
                    orders: user['totalOrders'],
                    numberOfSuccess: user['successfulOrder'],
                    percentageOfSuccess:
                        user['percentageOfSuccessfulOrder'].toFixed(2),
                    restrict: user['softDeleted'],
                })
            }
            setListUser(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()

        return () => {
            setListUser([])
        }
    }, [])

    const handleSwitchChange = async (record, e) => {
        try {
            const response = await axiosInstance.put(`/user/soft/${record.key}`)
            if (response.data.softDeleted === true)
                notification.success({
                    message: 'Khóa tài khoản người dùng thành công',
                })
            else
                notification.success({
                    message: 'Kích hoạt tài khoản người dùng thành công',
                })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Chỉnh sửa người dùng thất bại',
                description: error.response?.data.message,
            })
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
                <span style={{ fontWeight: 'bold' }}>Thông tin cá nhân</span>
            ),
            dataIndex: 'info',
            align: 'center',
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Họ và tên</span>
                    ),
                    dataIndex: 'name',
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
                        <span style={{ fontWeight: 'bold' }}>Email</span>
                    ),
                    dataIndex: 'email',
                    align: 'center',
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Tích luỹ</span>,
            // dataIndex: 'rank',
            align: 'center',
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            Hạng thành viên
                        </span>
                    ),
                    dataIndex: 'rank',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            Điểm tích luỹ
                        </span>
                    ),
                    dataIndex: 'rankingPoint',
                    align: 'center',
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Liên hệ</span>,
            // dataIndex: 'rank',
            align: 'center',
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Địa chỉ</span>
                    ),
                    dataIndex: 'address',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Phường</span>
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
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Đơn hàng</span>,
            // dataIndex: 'rank',
            align: 'center',

            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Tổng số đơn</span>
                    ),
                    dataIndex: 'orders',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Thành công</span>
                    ),
                    align: 'center',
                    children: [
                        {
                            title: () => (
                                <span style={{ fontWeight: 'bold' }}>
                                    Số lượng
                                </span>
                            ),
                            align: 'center',
                            dataIndex: 'numberOfSuccess',
                        },
                        {
                            title: () => (
                                <span style={{ fontWeight: 'bold' }}>
                                    Tỷ lệ
                                </span>
                            ),
                            align: 'center',
                            dataIndex: 'percentageOfSuccess',
                            render: (value) => (
                                <h3
                                    style={{
                                        color: value < 50 ? 'red' : 'green',
                                    }}
                                >
                                    {value}%
                                </h3>
                            ),
                        },
                    ],
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}></span>,
            align: 'center',
            dataIndex: 'restrict',
            render: (value, record) => (
                <Space>
                    <Switch
                        style={{ width: '100%' }}
                        checkedChildren="Kích hoạt"
                        unCheckedChildren="Hạn chế"
                        defaultChecked={!value}
                        onChange={(e) => handleSwitchChange(record, e)}
                    />
                </Space>
            ),
            // sorter: (a, b) => a.no - b.no,
        },
    ]
    const defaultTitle = () => <h1>Danh sách khách hàng</h1>

    return (
        <div>
            <Spin spinning={loading} size="large" tip="Loading...">
                <Table
                    columns={columns}
                    title={defaultTitle}
                    dataSource={listUser}
                    bordered
                    size="large"
                    pagination={{
                        position: ['topRight'],
                        defaultPageSize: 10,
                        defaultCurrent: 1,
                        hideOnSinglePage: true,
                    }}
                ></Table>
            </Spin>
        </div>
    )
}

export default ManageUser
