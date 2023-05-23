import { useContext, useEffect, useRef, useState } from 'react'
import './Cart.css'
import { Link, useNavigate } from 'react-router-dom'
import { QuantityPicker } from 'react-qty-picker'
import ReactHtmlParser from 'react-html-parser'
import { Button, notification } from 'antd'
import axiosInstance from '../../utils/axiosInstance'
import CartContext from '../../context/CartContext'

function Header({ itemCount }) {
    return (
        <header className="container">
            <h1>Giỏ hàng</h1>

            <ul className="breadcrumb">
                <li>
                    <Link to="/">Trang chủ</Link>
                </li>
                <li>Giỏ hàng</li>
            </ul>

            <span className="count">{itemCount} sản phẩm trong giỏ hàng</span>
        </header>
    )
}

function ProductList({ products, onChangeProductQuantity, onRemoveProduct }) {
    return (
        <section className="container">
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
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {formatCurrency(
                                                product.product.price
                                            )}
                                        </span>{' '}
                                    </div>
                                    <div
                                        className="price"
                                        style={{ fontSize: '1rem' }}
                                    >
                                        Thành tiền:{' '}
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {formatCurrency(
                                                product.product.price *
                                                    product.quantity
                                            )}
                                        </span>
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

                                <div className="remove">
                                    <svg
                                        onClick={() => onRemoveProduct(index)}
                                        version="1.1"
                                        className="close"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 60 60"
                                        enableBackground="new 0 0 60 60"
                                    >
                                        <polygon points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812" />
                                    </svg>
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
    const total = subTotal - discount + subTotal * 0.1

    // const checkPromoCode = (e)=>{
    //     console.log(onEnterPromoCode);
    // }
    const navigate = useNavigate()

    const handleCheckout = () => {
        const user = localStorage.getItem('user')
        if (user) navigate('/checkout')
        else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng đăng nhập trước khi thanh toán',
                duration: 2,
                
            })
            navigate('/login')
        }
    }

    return (
        <section className="container">
            {/* <div className="promotion">
                <label htmlFor="promo-code">Have A Promo Code?</label>
                <input type="text" onChange={onEnterPromoCode} />
                <button type="button" onClick={checkPromoCode} />
            </div> */}

            <div
                className="summary"
                style={{ float: 'right', marginRight: '12px' }}
            >
                <ul>
                    <li>
                        Giá trị đơn hàng:{' '}
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                            {formatCurrency(subTotal)}
                        </span>
                    </li>
                    {discount > 0 && (
                        <li>
                            Chiết khấu{' '}
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                {formatCurrency(discount)}
                            </span>
                        </li>
                    )}
                    <li>
                        VAT (10%){' '}
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                            {formatCurrency(subTotal * 0.1)}
                        </span>
                    </li>
                    <li className="total">
                        Tổng tiền{' '}
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                            {formatCurrency(total)}
                        </span>
                    </li>
                </ul>
            </div>

            <div className="checkout">
                <button type="button" onClick={handleCheckout}>
                    Tiến hành thanh toán
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

function Page() {
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
            message: 'Đã xóa sản phẩm ra khỏi giỏ hàng',
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
            <Header itemCount={itemCount || 0} />

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
                    <h3>Không có sản phẩm trong giỏ hàng.</h3>
                    <Link to="/">
                        <button>Mua hàng ngay</button>
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

export default Page
