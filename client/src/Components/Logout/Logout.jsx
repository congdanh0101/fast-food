import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    navigate('/')
    window.location.reload()
    return null
}

export default Logout
