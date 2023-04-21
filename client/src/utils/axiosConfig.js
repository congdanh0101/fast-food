import axios from 'axios'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'

axios.defaults.withCredentials = true

let accesToken = localStorage.getItem('accessToken') || null

const request = axios.create({
    baseURL: 'http://localhost:2001/api',
    headers: {
        'Content-Type': ['application/json'],
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
})


export default request
