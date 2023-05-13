import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { useEffect } from 'react'

const Logout = () => {
    const navigate = useNavigate()

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userID')

    window.location.reload()
    return null
}

export default Logout
