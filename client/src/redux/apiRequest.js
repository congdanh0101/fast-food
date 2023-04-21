import Notification from '../Components/Message/Notification'
import request from '../utils/axiosConfig'
import {
    loginFailure,
    loginStart,
    loginSuccess,
    registerFailure,
    registerStart,
    registerSuccess,
    verifyFailure,
    verifyStart,
    verifySuccess,
} from './authSlice'
import {
    getProductFailure,
    getProductStart,
    getProductSuccess,
} from './productSlice'

import { notification } from 'antd'

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart())
    try {
        const response = await request.post(`/auth/login`, user)
        dispatch(loginSuccess(response.data))
        // localStorage.setItem('accessToken', response.data['accessToken'])
        // localStorage.setItem('refreshToken', response.data['refreshToken'])
        // localStorage.setItem('userID', response.data['user']['_id'])
        // localStorage.setItem('user', JSON.stringify(response.data['user']))
        const accessToken = {
            accessToken: response.data['accessToken'],
        }
        const refreshToken = {
            refreshToken: response.data['refreshToken'],
        }
        localStorage.setItem('accessToken', JSON.stringify(accessToken))
        localStorage.setItem('user', JSON.stringify(response.data['user']))
        localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
        notification.success({
            message: 'Login successfully',
            duration: 3,
        })
        setTimeout(() => {
            navigate('/')
            window.location.reload()
        }, 500)
    } catch (error) {
        notification.error({
            message: 'Login failure',
            description:
                error.response.data.message || 'Invalid username or password',
            duration: 3,
        })
        dispatch(loginFailure())
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        const response = await request.post(`/auth/register`, user)
        // request
        //     .post('/auth/register', user)
        //     .then((data) => {
        //         const setCookieHeader = data.headers['set-cookie']
        //         if (setCookieHeader instanceof Array) {
        //             console.log('Cookies:')
        //             setCookieHeader.forEach((cookie) => console.log(cookie))
        //         } else console.log('Cookie:', setCookieHeader)
        //     })
        //     .catch((error) => console.log(error))

        // console.log(response.data)
        // console.log(`cookie ${response.headers['Set-Cookie']}`)
        // localStorage.setItem('user', JSON.stringify(response.data.user))
        // localStorage.setItem('code', response.data.code)
        // localStorage.setItem('expired', response.data.expired)
        dispatch(registerSuccess())
        notification.success({
            message: 'Register successfully',
            duration: 2,
        })
        navigate(`/verify/register`)
    } catch (error) {
        console.log(error)
        console.log(error.response.data.message)
        notification.error({
            message: 'Login failure',
            description: error.response.data.message.email,
            duration: 2,
        })
        dispatch(registerFailure())
    }
}

export const createUser = async (user, dispatch, navigate) => {
    dispatch(verifyStart())
    try {
        const response = await request.post('/user', user)
        localStorage.removeItem('user')
        localStorage.removeItem('expired')
        localStorage.removeItem('code')
        dispatch(verifySuccess())
        navigate('/login')
    } catch (error) {
        dispatch(verifyFailure())
    }
}

export const verifyRegisterUser = async (code, dispatch, navigate) => {
    dispatch(verifyStart())
    try {
        const response = await request.post('/auth/verify/register', { code })

        // localStorage.removeItem('user')
        // localStorage.removeItem('expired')
        // localStorage.removeItem('code')
        dispatch(verifySuccess())
        navigate('/login')
    } catch (error) {
        dispatch(verifyFailure())
    }
}

export const getProductById = async (id, dispatch, navigate) => {
    console.log(id)

    dispatch(getProductStart())
    try {
        const response = await request.get(`/product/${id}`)
        // console.log(response.data);

        dispatch(getProductSuccess(response.data))
        navigate(`/product/${id}`)
    } catch (error) {
        dispatch(getProductFailure())
    }
}
