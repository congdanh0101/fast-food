import { useContext, useEffect, useRef, useState } from 'react'
import './CartCheckout.css'
import { Link, useNavigate } from 'react-router-dom'
import { QuantityPicker } from 'react-qty-picker'
import ReactHtmlParser from 'react-html-parser'
import { Button, notification } from 'antd'
import axiosInstance from '../../utils/axiosInstance'
import CartContext from '../../context/CartContext'
import { Table } from 'react-bootstrap'

function Header({ itemCount }) {
    return (
        <header className="container">
            <h1>Giỏ hàng</h1>

            <ul className="breadcrumb">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>Shopping Cart</li>
            </ul>

            <span className="count">{itemCount} items in the bag</span>
        </header>
    )
}

function ProductList({ products, onChangeProductQuantity, onRemoveProduct }) {
    return (
        <section className="container">
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan={2}>Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <ul className="products">
                {products.map((product, index) => {
                    return (
                        <li className="row" key={index}>
                            <div className="col left">
                                <div className="thumbnail">
                                    <a href="#">
                                        <img
                                            src={product.product.img}
                                            alt={product.product.name}
                                        />
                                    </a>
                                </div>
                                <div className="detail">
                                    <div className="name">
                                        <Link
                                            to={`/product/${product.product._id}`}
                                        >
                                            <h1>{product.product.name}</h1>
                                        </Link>
                                    </div>
                                    <div className="description">
                                        {ReactHtmlParser(
                                            product.product.description
                                        )}
                                    </div>
                                    <div
                                        className="price"
                                        style={{ fontSize: '1rem' }}
                                    >
                                        Đơn giá:{' '}
                                        {formatCurrency(product.product.price)}
                                    </div>
                                    <div
                                        className="price"
                                        style={{ fontSize: '1rem' }}
                                    >
                                        Thành tiền:{' '}
                                        <>
                                            {formatCurrency(
                                                product.product.price *
                                                    product.quantity
                                            )}
                                        </>
                                    </div>
                                </div>
                            </div>

                            <div className="col right">
                                <div className="quantity">
                                    {/* <input
                                        type="text"
                                        className="quantity"
                                        step="1"
                                        value={product.quantity}
                                        onChange={(event) =>
                                            onChangeProductQuantity(
                                                index,
                                                event
                                            )
                                        }
                                    /> */}
                                    {/* <QuantityPicker
                                        onChange={(value) => {
                                            onChangeProductQuantity(value)
                                            const price =
                                                product.product.price * value
                                            console.log(price)
                                        }}
                                        min={1}
                                        value={product.quantity}
                                        max={99}
                                        smooth
                                    /> */}
                                    <QuantityPicker
                                        onChange={(event) => {
                                            onChangeProductQuantity(
                                                index,
                                                event
                                            )
                                        }}
                                        min={1}
                                        value={product.quantity}
                                        max={99}
                                        smooth
                                    />
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

function Summary({
    subTotal,
    discount,
    tax,
    onEnterPromoCode,
    checkPromoCode,
    voucher,
}) {
    const total = subTotal - discount + tax

    // const checkPromoCode = (e)=>{
    //     console.log(onEnterPromoCode);
    // }
    const navigate = useNavigate()

    const handleCheckout = () => {
        const user = localStorage.getItem('user')
        if (user) navigate('/checkout')
        else navigate('/login')
    }

    return (
        <section className="container">
            {/* <div className="promotion">
                <label htmlFor="promo-code">Have A Promo Code?</label>
                <input type="text" onChange={onEnterPromoCode} />
                <button type="button" onClick={checkPromoCode} />
            </div> */}

            <div className="summary" style={{ float: 'right' }}>
                <ul>
                    <li>
                        Subtotal <span>{formatCurrency(subTotal)}</span>
                    </li>
                    {discount > 0 && (
                        <li>
                            Discount <span>{formatCurrency(discount)}</span>
                        </li>
                    )}
                    <li>
                        Tax <span>{formatCurrency(tax)}</span>
                    </li>
                    <li className="total">
                        Total <span>{formatCurrency(total)}</span>
                    </li>
                </ul>
            </div>

            <div className="checkout">
                <button type="button" onClick={handleCheckout}>
                    Check Out
                </button>
            </div>
        </section>
    )
}

const PROMOTIONS = [
    {
        code: 'SUMMER',
        discount: '50%',
    },
    {
        code: 'AUTUMN',
        discount: '40%',
    },
    {
        code: 'WINTER',
        discount: '30%',
    },
]
const TAX = 0

function CartCheckout() {
    const { getCountItem } = useContext(CartContext)

    const items = JSON.parse(localStorage.getItem('items'))
    const [products, setProducts] = useState(items)
    const [promoCode, setPromoCode] = useState('')
    const [discountPercent, setDiscountPercent] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [voucher, setVoucher] = useState({})
    const itemCount =
        products?.reduce((quantity, product) => {
            return quantity + +product.quantity
        }, 0) || 0
    const subTotal =
        products?.reduce((total, product) => {
            return total + product.product.price * +product.quantity
        }, 0) || 0
    // const discount = (subTotal * discountPercent) / 100

    const onChangeProductQuantity = async (index, event) => {
        const cloneProducts = [...products]
        const value = event
        console.log(index)

        const valueInt = parseInt(value)

        // Minimum quantity is 1, maximum quantity is 100, can left blank to input easily
        if (value === '') {
            cloneProducts[index].quantity = value
        } else if (valueInt > 0 && valueInt < 100) {
            cloneProducts[index].quantity = valueInt
        }
        localStorage.setItem('items', JSON.stringify(cloneProducts))
        setProducts(cloneProducts)
    }

    const onRemoveProduct = (i) => {
        const filteredProduct = products.filter((product, index) => {
            return index !== i
        })
        localStorage.setItem('items', JSON.stringify(filteredProduct))
        setProducts(filteredProduct)
        getCountItem()
        setPromoCode(promoCode)
        notification.success({
            message: 'Remove Product Success',
            duration: 1,
        })
    }

    const onEnterPromoCode = (event) => {
        setPromoCode(event.target.value)
    }

    const checkPromoCode = async () => {
        try {
            const response = await axiosInstance.post('/voucher/use', {
                code: promoCode,
                value: subTotal,
            })
            setDiscount(response.data.discount)
            notification.success({
                message: 'Promo Code',
                description: 'Successfully',
            })
            return
        } catch (error) {
            setDiscount(0)
            console.log(error)
            notification.error({
                message: 'Promo Code',
                description: error.response.data.message,
            })
        }
        // alert('Sorry, the Promotional code you entered is not valid!')
    }

    return (
        <div>
            {/* <Header itemCount={itemCount || 0} /> */}

            {products?.length > 0 ? (
                <div>
                    <ProductList
                        products={products}
                        onChangeProductQuantity={onChangeProductQuantity}
                        onRemoveProduct={onRemoveProduct}
                    />

                    <Summary
                        subTotal={subTotal}
                        discount={discount}
                        voucher={voucher}
                        tax={TAX}
                        onEnterPromoCode={onEnterPromoCode}
                        checkPromoCode={checkPromoCode}
                    />
                </div>
            ) : (
                <div className="empty-product">
                    <h3>There are no products in your cart.</h3>
                    <Link to="/">
                        <button>Shopping now</button>
                    </Link>
                </div>
            )}
        </div>
    )
}

function formatCurrency(value) {
    return Number(value).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
    })
}

export default CartCheckout
