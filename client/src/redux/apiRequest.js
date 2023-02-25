import axios from 'axios'
import cookie from 'react-cookie'

import {
    loginFailure,
    loginStart,
    loginSuccess,
    registerFailure,
    registerStart,
    registerSuccess,
} from './authSlice'
const API_URL = `http://localhost:2001/api`

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart())
    try {
        const respone = await axios.post(`${API_URL}/auth/login`, user)
        dispatch(loginSuccess(respone.data))
        navigate('/')
    } catch (error) {
        dispatch(loginFailure())
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        const respone = await axios.post(`${API_URL}/auth/register`, user, {
            // withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    
        console.log(respone.config)
        dispatch(registerSuccess(respone.data))
        // navigate(`/login`)
    } catch (error) {
        dispatch(registerFailure())
    }
}
