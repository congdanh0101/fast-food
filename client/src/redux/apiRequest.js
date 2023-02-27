import request from '../utils/axiosConfig'
import {
    loginFailure,
    loginStart,
    loginSuccess,
    registerFailure,
    registerStart,
    registerSuccess,
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
        const respone = await request.post(`/auth/register`, user, {
            headers: {
                ck: `haha`,
            },
        })
        // console.log(respone.headers['set-cookie'])
        // console.log(respone.headers)
        console.log(respone.data)
        // console.log(respone.data.user)
        // localStorage.setItem('code',respone.data.code)
        // // localStorage.setItem('user',respone.data.user)
        // localStorage.getItem('user')
        document.cookie = `registerVerificationCode=${
            respone.data.code
        };maxAge=${60 * 1000}`
        dispatch(registerSuccess(respone.data))
        navigate(`/verify/register`)
    } catch (error) {
        dispatch(registerFailure())
    }
}
