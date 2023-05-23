import { createContext, useContext, useEffect, useState } from 'react'

// export function useShoppingCart() {
//     return useContext(CartContext)
// }

const CartContext = createContext({})

export function NavbarProvider({ children }) {
    const [count, setCount] = useState(0)
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [selectMethod, setSelectMethod] = useState('Online')

    const getCountItem = () => {
        const items = JSON.parse(localStorage.getItem('items')) || []
        const badgeQuantity = items.length
        setCount(badgeQuantity)
    }

    const getUser = () => {
        const currentUser = JSON.parse(localStorage.getItem('user'))
        if (currentUser) setUser(currentUser)
        if (currentUser?.roles.length >= 2) setIsAdmin(true)
    }


    useEffect(() => {
        getCountItem()
        getUser()
        return () => {
            setCount(0)
            setUser(null)
        }
    }, [])

    return (
        <CartContext.Provider
            value={{
                count,
                getCountItem,
                user,
                getUser,
                isAdmin,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export default CartContext
