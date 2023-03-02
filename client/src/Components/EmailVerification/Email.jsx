import { useDispatch } from 'react-redux'
import request from '../../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../../redux/apiRequest'
const { useState } = require('react')

const Email = () => {
    const [code, setCode] = useState('')
    const [message, setMessage] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    console.log(code)

    const handleSubmit = async (e) => {
        e.preventDefault()
        // const res = await request.post('/auth/verify/register', { code })
        const now = new Date().getTime()
        const expired = localStorage.getItem('expired')
        const user = JSON.parse(localStorage.getItem('user'))
        const verificationCode = localStorage.getItem('code')
        if (now > expired) {
            console.log(`Token is expired`)
            setMessage(`Token is expired`)
        } else {
            if (code !== verificationCode) setMessage('Invalid code')
            else createUser(user,dispatch,navigate)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>EMAIL VERIFICATION CODE</label>
                <input
                    type="text"
                    placeholder="your email verification code"
                    onChange={(e) => setCode(e.target.value)}
                />
                <h3>{message}</h3>
                <button type="submit">submit</button>
            </form>
        </div>
    )
}

export default Email
