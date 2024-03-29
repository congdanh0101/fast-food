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
        const accessToken = {
            accessToken: response.data['accessToken'],
        }
        localStorage.setItem('userID', response.data['user']['_id'])
        localStorage.setItem('accessToken', JSON.stringify(accessToken))
        localStorage.setItem('user', JSON.stringify(response.data['user']))
        notification.success({
            message: 'Đăng nhập thành công',
            duration: 3,
        })
        if (response.data['user']['roles'].includes('ADMIN'))
            setTimeout(() => {
                navigate('/admin/dashboard')
                window.location.reload()
            }, 500)
        else
            setTimeout(() => {
                navigate('/')
                window.location.reload()
            }, 500)
    } catch (error) {
        notification.error({
            message: 'Đăng nhập thất bại',
            description: error.response?.data.message,
            duration: 3,
        })
        dispatch(loginFailure())
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        const response = await request.post(`/auth/register`, user)
        localStorage.setItem('registerUser', JSON.stringify(user))

        dispatch(registerSuccess())
        notification.success({
            message: 'Đăng ký thành công',
            duration: 2,
        })
        navigate(`/verify/register`)
    } catch (error) {
        console.log(error)
        console.log(error.response?.data.message)
        notification.error({
            message: 'Đăng ký thất bại',
            description: error.response?.data.message.email,
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
        localStorage.removeItem('registerUser')
        notification.success({
            message: 'Xác thực thành công',
        })
        setTimeout(() => {
            dispatch(verifySuccess())
            navigate('/login')
        }, 500)
    } catch (error) {
        dispatch(verifyFailure())
        notification.error({
            message: 'Xác thực thất bại',
            description: error.response.data.message,
        })
    }
}

export const verifyForogotPassword = async (code, navigate) => {
    try {
        const response = await request.post('/auth/verify/forgot', {
            code: code,
        })
        localStorage.removeItem('email')
        notification.success({
            message: 'Đổi mật khẩu thành công',
            description:
                'Mật khẩu mới được gửi tới địa chỉ email cá nhân của bạn. Vui lòng kiểm tra email!',
        })

        setTimeout(() => navigate('/login'), 500)
    } catch (error) {
        console.log(error)
        notification.error({
            message: 'Có lỗi xảy ra',
            description: error.response.data.message,
        })
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
