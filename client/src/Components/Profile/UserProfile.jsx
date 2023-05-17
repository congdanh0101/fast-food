import {
    Avatar,
    Button,
    Col,
    Divider,
    Form,
    Input,
    Menu,
    Radio,
    Row,
    Space,
    Typography,
} from 'antd'
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    InfoCircleOutlined,
    PlusCircleOutlined,
    PhoneOutlined,
    TransactionOutlined,
} from '@ant-design/icons'
import { useContext, useEffect, useState } from 'react'
import { FormLabel } from 'react-bootstrap'
import UserInformation from './UserInformation'
import Security from './Security'
import UserInfo from './UserInfo'
import Reward from './Reward'
import Transaction from './Transaction'
import CartContext from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    }
}

const items = [
    getItem(
        'Thông tin',
        'info',
        <InfoCircleOutlined style={{ fontSize: '150%' }} />
    ),
    getItem(
        'Bảo mật',
        'security',
        <LockOutlined style={{ fontSize: '150%' }} />
    ),
    getItem(
        'Điểm thưởng',
        'reward',
        <PlusCircleOutlined style={{ fontSize: '150%' }} />
    ),
    getItem(
        'Lịch sử mua hàng',
        'trans',
        <TransactionOutlined style={{ fontSize: '150%' }} />
    ),
]

function UserProfile() {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)


    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    const getUser = () => {
        const currentUser = JSON.parse(localStorage.getItem('user'))
        if (currentUser) {
            setUser(currentUser)
            if(currentUser?.roles.length>=2) navigate('/notfound')
        }
        else navigate('/login')
    }

    useEffect(() => {
        getUser()
        return () => {
            setUser(null)
        }
    }, [])

    const [key, setKey] = useState('info')

   

    const handleMenuChanged = (e) => {
        console.log(e.key)
        setKey(e.key)
    }

    return (
        <div>
            {items.length > 0 && (
                <Menu
                    items={items}
                    defaultSelectedKeys={[items[0]?.key]}
                    mode="horizontal"
                    style={{
                        fontSize: '100%',
                        fontWeight: 'bold',
                        marginTop: '3rem',
                    }}
                    onClick={handleMenuChanged}
                ></Menu>
            )}
            {user && key === 'info' && <UserInfo />}
            {user && key === 'security' && <Security />}
            {user && key === 'reward' && <Reward />}
            {user && key === 'trans' && <Transaction />}
        </div>
    )
}

export default UserProfile
