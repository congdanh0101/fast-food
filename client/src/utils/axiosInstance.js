import axios from 'axios'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'

axios.defaults.withCredentials = true

let token = localStorage.getItem('accessToken')
    ? JSON.parse(localStorage.getItem('accessToken'))
    : null

const axiosInstance = axios.create({
    baseURL: 'http://localhost:2001/api',
    headers: {
        'Content-Type': ['application/json'],
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        Authorization: `Bearer ${token?.accesToken}`,
    },
})

axiosInstance.interceptors.request.use(async (req) => {
    if (!token) {
        token = localStorage.getItem('accessToken')
            ? JSON.parse(localStorage.getItem('accessToken'))
            : null
        req.headers.Authorization = `Bearer ${token?.accesToken}`
    }

    const userDecode = jwt_decode(token['accessToken'])

    const isExpired = dayjs.unix(userDecode.exp).diff(dayjs()) < 1

    if (!isExpired) return req

    try {
        const response = await axios.put(
            'http://localhost:2001/api/auth/refreshtoken'
        )
        localStorage.setItem('accessToken', JSON.stringify(response.data))
        req.headers.Authorization = `Bearer ${response.data['accesToken']}`
    } catch (error) {
        console.log(error)
    }

    return req
})

export default axiosInstance
