import axios from 'axios'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'

axios.defaults.withCredentials = true

let token = localStorage.getItem('accessToken')
    ? JSON.parse(localStorage.getItem('accessToken'))
    : null
let access
if (token != null) access = token['accessToken']

const axiosInstance = axios.create({
    baseURL: 'http://44.210.141.132:2001/api',
    headers: {
        'Content-Type': ['application/json'],
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        Authorization: `Bearer ${access}`,
    },
})

axiosInstance.interceptors.request.use(async (req) => {
    if (!token) {
        token = localStorage.getItem('accessToken')
            ? JSON.parse(localStorage.getItem('accessToken'))
            : null
        req.headers.Authorization = `Bearer ${token['accesToken']}`
    }

    const userDecode = jwt_decode(token['accessToken'])

    const isExpired = dayjs.unix(userDecode.exp).diff(dayjs()) < 1

    console.log('expired ', parseInt(userDecode.exp) * 1000)
    console.log('now ', new Date().getTime())
    const gap = parseInt(userDecode.exp) * 1000 - new Date().getTime()
    console.log(gap)
    const checkexpired = parseInt(userDecode.exp) * 1000 >= new Date().getTime()
    console.log(checkexpired)

    if (checkexpired) return req

    // if (!isExpired) return req

    try {
        const response = await axios.put(
            'http://localhost:2001/api/auth/refreshtoken'
        )
        localStorage.setItem('accessToken', JSON.stringify(response.data))
        access = response.data['accessToken']
        req.headers.Authorization = `Bearer ${access}`
    } catch (error) {
        console.log(error)
    }

    return req
})

export default axiosInstance
