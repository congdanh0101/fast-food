import { Badge, Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const HomeIcon = () => {
    return (
        <Link to="/" style={{ fontSize: '1.5rem' }}>
            Trang chủ
            <HomeOutlined style={{ fontSize: '3rem',}} />
        </Link>
    )
}

export default HomeIcon
