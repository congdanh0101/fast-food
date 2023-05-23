import { Link, useLocation, useNavigate } from 'react-router-dom'
import './PaymentFailure.css'
import { useContext, useEffect, useState } from 'react'
import CartContext from '../../context/CartContext'

const OrderSuccessfully = () => {
    const [message, setMessage] = useState('')

    const navigate = useNavigate()
    const location = useLocation()
    const context = useContext(CartContext)
    // const getMessagePayment = () => {
    //     debugger
    //     const queryParams = new URLSearchParams(location.search)
    //     const data = queryParams.get('message')
    //     if (data)
    //         localStorage.removeItem('items')
    //     else navigate('/notfound')
    //     setMessage(data)
    // }

    useEffect(() => {
        localStorage.removeItem('items')
        context.getCountItem()
    }, [])

    return (
        <div id="paymentfailure">
            <div class="paymentfailure">
                <div class="paymentfailure-404">
                    <h1>2🤑🤑</h1>
                </div>
                <h2>Wow! Đặt hàng thành công</h2>
                <Link to={'/'} style={{ marginTop: '1rem' }}>
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    )
}

export default OrderSuccessfully
