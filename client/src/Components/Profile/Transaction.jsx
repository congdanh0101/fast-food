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
const items = [
    {
        key: '1',
        label: 'Action 1',
    },
    {
        key: '2',
        label: 'Action 2',
    },
]
const Transaction = () => {
    const expandedRowRender = () => {
        const columns = [
            { title: '#', dataIndex: 'No', key: 'No' },
            {
                title: 'Product',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: 'Quantity',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Status',
                key: 'state',
                render: () => <Badge status="success" text="Finished" />,
            },
            {
                title: 'Price',
                dataIndex: 'upgradeNum',
                key: 'upgradeNum',
            },
        ]
        const data = []
        for (let i = 0; i < 3; ++i) {
            data.push({
                key: i.toString(),
                No: (i + 1).toString(),
                date: '2014-12-24 23:12:00',
                name: 'This is production name',
                upgradeNum: 'Upgraded: 56',
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
            key: 'no',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: 'Upgraded',
            dataIndex: 'upgradeNum',
            key: 'upgradeNum',
        },
        {
            title: 'Creator',
            dataIndex: 'creator',
            key: 'creator',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Action',
            key: 'operation',
            render: () => <a>Publish</a>,
        },
    ]
    const data = []
    for (let i = 0; i < 3; ++i) {
        data.push({
            key: i.toString(),
            no:(i+1).toString(),
            name: 'Screen',
            platform: 'iOS',
            version: '10.3.4.5654',
            upgradeNum: 500,
            creator: 'Jack',
            createdAt: '2014-12-24 23:12:00',
        })
    }
    return (
        <>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender,
                    // defaultExpandedRowKeys: ['0'],
                }}
                dataSource={data}
                size="middle"
            />
        </>
    )
}
export default Transaction
