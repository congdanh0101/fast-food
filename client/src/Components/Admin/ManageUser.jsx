import { Space, Switch, Table, notification } from 'antd'
import { useState } from 'react'
import request from '../../utils/axiosConfig'
import { useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'

const ManageUser = () => {
    const [listUser, setListUser] = useState([])

    const fetchUser = async () => {
        try {
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
            // sorter: (a, b) => a.no - b.no,
        },
        {
            title: () => (
                <span style={{ fontWeight: 'bold' }}>Thong tin ca nhan</span>
            ),
            dataIndex: 'info',
            align: 'center',
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Ho va ten</span>
                    ),
                    dataIndex: 'name',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            So dien thoai
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
            title: () => <span style={{ fontWeight: 'bold' }}>Tich luy</span>,
            // dataIndex: 'rank',
            align: 'center',
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            Hang thanh vien
                        </span>
                    ),
                    dataIndex: 'rank',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>
                            Diem tich luy
                        </span>
                    ),
                    dataIndex: 'rankingPoint',
                    align: 'center',
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Lien he</span>,
            // dataIndex: 'rank',
            align: 'center',
            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Dia chi</span>
                    ),
                    dataIndex: 'address',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Phuong</span>
                    ),
                    dataIndex: 'ward',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Quan</span>
                    ),
                    dataIndex: 'district',
                    align: 'center',
                },
            ],
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Don hang</span>,
            // dataIndex: 'rank',
            align: 'center',

            children: [
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Tong so don</span>
                    ),
                    dataIndex: 'orders',
                    align: 'center',
                },
                {
                    title: () => (
                        <span style={{ fontWeight: 'bold' }}>Thanh cong</span>
                    ),
                    align: 'center',
                    children: [
                        {
                            title: () => (
                                <span style={{ fontWeight: 'bold' }}>
                                    So luong
                                </span>
                            ),
                            align: 'center',
                            dataIndex: 'numberOfSuccess',
                        },
                        {
                            title: () => (
                                <span style={{ fontWeight: 'bold' }}>
                                    Ti le
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
            title: () => <span style={{ fontWeight: 'bold' }}>#</span>,
            align: 'center',
            dataIndex: 'restrict',
            render: (value, record) => (
                <Space>
                    <Switch
                        style={{ width: '100%' }}
                        checkedChildren="Kich hoat"
                        unCheckedChildren="Han che"
                        defaultChecked={!value}
                        onChange={(e) => handleSwitchChange(record, e)}
                    />
                </Space>
            ),
            // sorter: (a, b) => a.no - b.no,
        },
    ]
    const defaultTitle = () => <h1>Danh sach khach hang</h1>

    return (
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
    )
}

export default ManageUser
