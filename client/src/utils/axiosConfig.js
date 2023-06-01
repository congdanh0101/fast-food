import axios from 'axios'
require('dotenv').config()
let accesToken = localStorage.getItem('accessToken') || null

const request = axios.create({
    baseURL: 'http://44.210.141.132:2001/api',
    headers: {
        'Content-Type': ['application/json'],
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
    withCredentials: true,
})

export default request
