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

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart())
    try {
        const respone = await request.post(`/auth/login`, user)
        dispatch(loginSuccess(respone.data))
        navigate('/')
    } catch (error) {
        dispatch(loginFailure())
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        const respone = await request.post(`/auth/register`, user)
        console.log(respone.data)
        localStorage.setItem('user', JSON.stringify(respone.data.user))
        localStorage.setItem('code', respone.data.code)
        localStorage.setItem('expired', respone.data.expired)
        dispatch(registerSuccess())
        navigate(`/verify/register`)
    } catch (error) {
        dispatch(registerFailure())
    }
}

export const createUser = async (user, dispatch, navigate) => {
    dispatch(verifyStart())
    try {
        const respone = await request.post('/user',  user )
        localStorage.removeItem('user')
        localStorage.removeItem('expired')
        localStorage.removeItem('code')
        dispatch(verifySuccess())
        navigate('/login')
    } catch (error) {
        dispatch(verifyFailure())
    }
}
