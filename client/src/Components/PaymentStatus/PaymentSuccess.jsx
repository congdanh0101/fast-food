import { Link, useLocation, useNavigate } from 'react-router-dom'
import './PaymentFailure.css'
import { useEffect, useState } from 'react'

const PaymentSuccess = () => {
    const [message, setMessage] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const getMessagePayment = () => {
        debugger
        const queryParams = new URLSearchParams(location.search)
        const data = queryParams.get('message')
        if (data)
            localStorage.removeItem('items')
        else navigate('/notfound')
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
                    <h1>2🤑🤑</h1>
                </div>
                <h2>Wow! {message}</h2>
                <Link to={'/'} style={{ marginTop: '1rem' }}>
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    )
}

export default PaymentSuccess
