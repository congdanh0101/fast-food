import { Link, useLocation, useNavigate } from 'react-router-dom'
import './PaymentFailure.css'
import { useEffect, useState } from 'react'
const PaymentFailure = () => {
    const [message, setMessage] = useState('')

    const location = useLocation()
    const navigate = useNavigate()

    const getMessagePayment = () => {
        const queryParams = new URLSearchParams(location.search)
        const data = queryParams.get('message')
        if (!data) navigate('/notfound')
        setMessage(data)
    }

    useEffect(() => {
        getMessagePayment()

        return () => {
            setMessage('')
        }
    }, [location.search])

    return (
        <div id="paymentfailure">
            <div class="paymentfailure">
                <div class="paymentfailure-404">
                    <h1>
                        5 <span></span>{' '}
                        <span style={{ marginLeft: '1rem' }}></span>
                    </h1>
                </div>
                <h2>Oops! Thanh toán không thành công</h2>
                <p>{message}</p>
                <Link to={'/'} style={{ marginTop: '1rem' }}>
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    )
}

export default PaymentFailure
