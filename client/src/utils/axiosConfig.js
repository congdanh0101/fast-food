import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:2001/api',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
})

export default request
