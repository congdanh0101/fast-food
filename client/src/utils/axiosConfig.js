import axios from 'axios'

let accesToken = localStorage.getItem('accessToken') || null

const request = axios.create({
    baseURL: 'http://localhost:2001/api',
    headers: {
        'Content-Type': ['application/json'],
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
    withCredentials: true,
})

export default request
