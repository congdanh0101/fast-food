import { useState } from 'react'
import request from '../../utils/axiosConfig'
import { Tab } from 'react-bootstrap'
import { Spin, Table } from 'antd'
import { useEffect } from 'react'

const ManageCategoryList = () => {
    const [loading, setLoading] = useState(false)
    const [categoryList, setCategoryList] = useState([])

    const fetchDataCategory = async () => {
        try {
            setLoading(true)

            const response = await request.get('/category')
            const data = []
            for (var i = 0; i < response.data.length; i++) {
                const cate = response.data[i]
                data.push({
                    key: cate['_id'],
                    no: (i + 1).toString(),
                    category: cate['name'],
                })
            }
            setCategoryList(data)

            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDataCategory()

        return () => {
            setCategoryList([])
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
                <span style={{ fontWeight: 'bold' }}>Loại sản phẩm</span>
            ),
            dataIndex: 'category',
            align: 'center',
        },
    ]

    return (
        <div>
            <Spin spinning={loading} size="large" tip="Loading...">
                <Table
                    columns={columns}
                    dataSource={categoryList}
                    bordered
                    pagination={{
                        defaultPageSize: 10,
                        hideOnSinglePage: true,
                    }}
                ></Table>
            </Spin>
        </div>
    )
}

export default ManageCategoryList
