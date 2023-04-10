import { useEffect, useState } from 'react'
import request from '../../utils/axiosConfig'
import { Menu } from 'antd'

const Category = () => {
    const [category, setCategory] = useState([])
    const [categoryID, setCategoryID] = useState('63f0add10207afdbe49f43ea')

    const fetchCategoryList = async () => {
        try {
            const cate = await request.get('/category')
            setCategoryID(cate.data[0]['_id'])
            setCategory(cate.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchCategoryList()
    }, [])

    const handleCategoryOnclick = (e) => {
        const categoryID = e.key
        setCategoryID(categoryID)
    }

    const getItem = (label, key, icon, children, type) => {
        return {
            key,
            icon,
            children,
            label,
            type,
        }
    }
    let items = []
    category.forEach((x) => items.push(getItem(x['name'], x['_id'])))

    return (
        <div>
            {items.length > 0 ? (
                <Menu
                    style={{
                        fontSize: '200%',
                        fontWeight: 'bold',
                        margin: 'auto',
                    }}
                    defaultSelectedKeys={[items[0]?.key]}
                    items={items}
                    onClick={handleCategoryOnclick}
                ></Menu>
            ) : (
                <></>
            )}
        </div>
    )
}

export default Category
