import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            success: false,
        },
        verify: {
            isFetching: false,
            error: false,
            success: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false
            state.login.currentUser = action.payload
            state.login.error = false
        },
        loginFailure: (state) => {
            state.login.isFetching = false
            state.login.error = true
        },
        registerStart: (state) => {
            state.register.isFetching = true
        },
        registerSuccess: (state, action) => {
            state.register.isFetching = false
            state.register.error = false
            state.register.success = true
        },
        registerFailure: (state) => {
            state.register.isFetching = false
            state.register.error = true
            state.register.success = false
        },
        verifyStart: (state) => {
            state.verify.isFetching = true
        },
        verifySuccess: (state, action) => {
            state.verify.isFetching = false
            state.verify.success = true
            state.verify.error = false
        },
        verifyFailure: (state) => {
            state.verify.isFetching = false
            state.verify.success = false
            state.verify.error = true
        },
    },
})

export const {
    loginStart,
    loginFailure,
    loginSuccess,
    registerFailure,
    registerStart,
    registerSuccess,
    verifyFailure,
    verifyStart,
    verifySuccess,
} = authSlice.actions

export default authSlice.reducer
