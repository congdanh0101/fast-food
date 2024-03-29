import { useContext, useEffect, useRef, useState } from 'react'
import './CartCheckout.css'
import { Link, useNavigate } from 'react-router-dom'
import { QuantityPicker } from 'react-qty-picker'
import ReactHtmlParser from 'react-html-parser'
import { Button, Radio, Table, notification } from 'antd'
import axiosInstance from '../../utils/axiosInstance'
import CartContext from '../../context/CartContext'
import request from '../../utils/axiosConfig'
import axios from 'axios'

function ProductList({ products }) {
    const [data, setData] = useState([])

    const getProduct = () => {
        const record = []
        for (var i = 0; i < products.length; i++) {
            const product = products[i].product
            const quantity = products[i].quantity
            record.push({
                key: product['_id'],
                product: getProductImage(product),
                quantity: quantity,
                price: currencyFormat(product['price']),
                totalPrice: currencyFormat(product['price'] * quantity),
            })
        }
        setData(record)
    }

    const getProductImage = (product) => {
        return (
            <div>
                <h2>{product['name']}</h2>
                <img src={product['img']} width={100} height={100}></img>
            </div>
        )
    }

    useEffect(() => {
        getProduct()

        return () => {
            setData([])
        }
    }, [])

    const columns = [
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Sản phẩm</span>,
            dataIndex: 'product',
            align: 'center',
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Số lượng</span>,
            dataIndex: 'quantity',
            align: 'center',
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Đơn giá</span>,
            dataIndex: 'price',
            align: 'center',
        },
        {
            title: () => <span style={{ fontWeight: 'bold' }}>Thành tiền</span>,
            dataIndex: 'totalPrice',
            align: 'center',
        },
    ]

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                bordered
                pagination={false}
            />
        </div>
    )
}

function Summary({
    subTotal,
    discount,
    onEnterPromoCode,
    checkPromoCode,
    feeShip,
    promoCode,
}) {
    const [discountRanking, setDiscountRankings] = useState(0)
    const [selectMethod, setSelectMethod] = useState('Online')
    const total =
        subTotal -
        discount +
        subTotal * 0.1 +
        feeShip -
        subTotal * discountRanking

    const getDiscountRanking = async () => {
        try {
            const response = await axiosInstance.get('/user/discount')
            setDiscountRankings(response.data.discount)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getDiscountRanking()

        return () => {
            setDiscountRankings(0)
        }
    }, [])

    const navigate = useNavigate()

    const handlePayment = async () => {
        const items = JSON.parse(localStorage.getItem('items'))

        const orderItems = []

        for (var i = 0; i < items.length; i++) {
            const product = items[i].product
            const quantity = items[i].quantity
            orderItems.push({
                product: product['_id'],
                quantity: quantity,
            })
        }

        console.log(items)
        console.log(promoCode)
        const order = {
            items: orderItems,
            payment: selectMethod,
            feeShip: feeShip,
            voucher: promoCode === '' ? null : promoCode,
        }
        console.log(order)
        const currentUser = JSON.parse(localStorage.getItem('user'))
        try {
            const responseOrder = await axiosInstance.post('/order', {
                items: orderItems,
                payment: selectMethod,
                feeShip: feeShip,
                voucher: promoCode === '' ? null : promoCode,
                contact: {
                    address: currentUser['address']['add'],
                    ward: currentUser['address']['ward']['name'],
                    district: currentUser['address']['district']['name'],
                    phoneNumber: currentUser['phoneNumber'],
                },
            })

            if (selectMethod === 'Online') {
                const orderID = responseOrder.data._id

                const response = request
                    .post('/payment/create_payment_url', {
                        orderID: orderID,
                    })
                    .then((res) => {
                        window.location.href = res.data.payment
                        // window.open(res.data.payment, '_blank')
                    })
                    .catch((err) => console.log(err))
            } else {
                navigate('/order/success')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="container">
            <div className="promotion">
                <label htmlFor="promo-code">Bạn có sử dụng mã giảm giá không?</label>
                <input type="text" onChange={onEnterPromoCode} />
                <button type="button" onClick={checkPromoCode} />
                <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    style={{ fontSize: '2rem' }}
                    defaultValue={'Online'}
                    onChange={(e) => setSelectMethod(e.target.value)}
                >
                    <Radio value="Online">Thanh toán Online</Radio>
                    <Radio value="Cash">Thanh toán COD</Radio>
                </Radio.Group>
            </div>

            <div className="summary">
                <ul>
                    <li>
                        Giá trị đơn hàng <span>{currencyFormat(subTotal)}</span>
                    </li>
                    {discount > 0 && (
                        <li>
                            Giảm giá voucher{' '}
                            <span>{currencyFormat(-discount)}</span>
                        </li>
                    )}
                    {discountRanking > 0 && (
                        <li>
                            Giảm giá hạng thành viên{' '}
                            <span>
                                {currencyFormat(-discountRanking * subTotal)}
                            </span>
                        </li>
                    )}
                    {feeShip > 0 && (
                        <li>
                            Phí giao hàng <span>{currencyFormat(feeShip)}</span>
                        </li>
                    )}
                    <li>
                        Thuế VAT(10%){' '}
                        <span>{currencyFormat(subTotal * 0.1)}</span>
                    </li>
                    <li className="total">
                        Tổng cộng <span>{currencyFormat(total)}</span>
                    </li>
                </ul>
            </div>

            <div className="checkout">
                <button type="button" onClick={handlePayment}>
                    Thanh toán
                </button>
            </div>
        </section>
    )
}

function CartCheckout({ selectPaymentMethod }) {
    const context = useContext(CartContext)

    const items = JSON.parse(localStorage.getItem('items'))
    const [products, setProducts] = useState(items)
    const [promoCode, setPromoCode] = useState('')
    const [discount, setDiscount] = useState(0)
    const [feeShip, setFeeShip] = useState(0)
    const [selectMethod, setSelectMethod] = useState('Online')

    const subTotal =
        products?.reduce((total, product) => {
            return total + product.product.price * +product.quantity
        }, 0) || 0

    const getFeeShip = async () => {
        const user = JSON.parse(localStorage.getItem('user'))
        // const obj = {
        //     from_district_id: 1461,
        //     service_id: 53320,
        //     service_type_id: null,
        //     to_district_id: parseInt(user?.address.district.code),
        //     to_ward_code: user?.address.ward.code,
        //     height: Math.floor(Math.random() * 50) + 1,
        //     length: Math.floor(Math.random() * 50) + 1,
        //     weight: Math.floor(Math.random() * 1000) + 1,
        //     width: Math.floor(Math.random() * 50) + 1,
        //     insurance_value: 10000,
        //     coupon: null,
        //     shop_id: 121162,
        // }
        try {
            // const resp = await fetch(
            //     `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
            //     {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': ['application/json', 'text/plain'],
            //             token: 'eab201ba-816f-11ed-a2ce-1e68bf6263c5',
            //         },
            //         body: JSON.stringify(obj),
            //     }
            // )
            // const response = await resp.json()
            // const data = await response.data
            // setFeeShip(data.total)
            if (
                user.address.district.code &&
                user.address.district.name &&
                user.address.ward.code &&
                user.address.ward.name &&
                user.address.add
            ) {
                const obj = {
                    from_district_id: 1461,
                    service_id: 53320,
                    service_type_id: null,
                    to_district_id: parseInt(user?.address.district.code),
                    to_ward_code: user?.address.ward.code,
                    height: Math.floor(Math.random() * 50) + 1,
                    length: Math.floor(Math.random() * 50) + 1,
                    weight: Math.floor(Math.random() * 1000) + 1,
                    width: Math.floor(Math.random() * 50) + 1,
                    insurance_value: 10000,
                    coupon: null,
                    shop_id: 121162,
                }
                const res = await axios.post(
                    'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                    obj,
                    {
                        headers: {
                            'Content-Type': ['application/json', 'text/plain'],
                            token: 'eab201ba-816f-11ed-a2ce-1e68bf6263c5',
                        },
                        withCredentials: false,
                    }
                )
                setFeeShip(res.data.data.total)
            }
        } catch (error) {
            notification.error({
                message: 'Có lỗi xảy ra, vui lòng thử lại',
                description: error.res?.data.message,
            })
            console.log(error)
        }
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
                message: 'Áp dụng voucher thành công',
            })
            return
        } catch (error) {
            setDiscount(0)
            console.log(error)
            notification.error({
                message: 'Áp dụng voucher thất bại',
                description: error.response.data.message,
            })
        }
        // alert('Sorry, the Promotional code you entered is not valid!')
    }

    useEffect(() => {
        getFeeShip()

        return () => {
            setFeeShip(0)
        }
    }, [])

    return (
        <div>
            {products?.length > 0 ? (
                <div>
                    <ProductList products={products} />

                    <Summary
                        subTotal={subTotal}
                        discount={discount}
                        onEnterPromoCode={onEnterPromoCode}
                        checkPromoCode={checkPromoCode}
                        feeShip={feeShip}
                        promoCode={promoCode}
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

const currencyFormat = (price) => (
    <h4 style={{ color: 'red' }}>
        {price.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
        })}
    </h4>
)

export default CartCheckout
