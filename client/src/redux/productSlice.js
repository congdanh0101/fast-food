import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: 'product',
    initialState: {
        getProduct: {
            isFetching: false,
            error: false,
            success: false,
            data: null,
        },
    },
    reducers: {
        getProductStart: (state) => {
            state.getProduct.isFetching = true
        },
        getProductSuccess: (state, action) => {
            state.getProduct.isFetching = false
            state.getProduct.data = action.payload
            state.getProduct.success = true
            state.getProduct.error = false
        },
        getProductFailure: (state, action) => {
            state.getProduct.isFetching = false
            state.getProduct.error = action.payload
            state.getProduct.success = false
        },
    },
})

export const { getProductStart, getProductSuccess, getProductFailure } =
    productSlice.actions

export default productSlice.reducer
