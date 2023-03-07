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

        // console.log(respone.data)
        // console.log(`cookie ${respone.headers['Set-Cookie']}`)
        // localStorage.setItem('user', JSON.stringify(respone.data.user))
        // localStorage.setItem('code', respone.data.code)
        // localStorage.setItem('expired', respone.data.expired)
        dispatch(registerSuccess())
        navigate(`/verify/register`)
    } catch (error) {
        dispatch(registerFailure())
    }
}

export const createUser = async (user, dispatch, navigate) => {
    dispatch(verifyStart())
    try {
        const respone = await request.post('/user', user)
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
        const respone = await request.post('/auth/verify/register', { code })

        // localStorage.removeItem('user')
        // localStorage.removeItem('expired')
        // localStorage.removeItem('code')
        dispatch(verifySuccess())
        navigate('/login')
    } catch (error) {
        dispatch(verifyFailure())
    }
}
