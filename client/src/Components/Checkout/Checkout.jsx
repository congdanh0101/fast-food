import { Col, Input, Row, notification } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { Form, FormGroup, FormLabel } from 'react-bootstrap'
import CartContext from '../../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { QuantityPicker } from 'react-qty-picker'
import ReactHtmlParser from 'react-html-parser'
import Page from '../Cart/CartClone'
import CartCheckout from './CartCheckout'

function formatCurrency(value) {
    return Number(value).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
    })
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

function Contact({ user }) {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Thông tin liên hệ</h1>
            <FormGroup
                className="mb-3"
                style={{
                    fontSize: '1.25rem',
                    boxShadow:
                        '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                }}
            >
                <Form.Label>
                    <h4>Họ và tên</h4>
                </Form.Label>
                <Form.Control
                    value={user?.fullName}
                    disabled
                    style={{
                        fontSize: '1.5rem',
                        backgroundColor: '#ccc',
                        boxShadow:
                            '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    }}
                />
                <Form.Label>
                    <h4>Số điện thoại</h4>
                </Form.Label>
                <Form.Control
                    value={user?.phoneNumber}
                    disabled
                    style={{
                        fontSize: '1.5rem',
                        backgroundColor: '#ccc',
                        boxShadow:
                            '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    }}
                />
                <Form.Label>
                    <h4>Địa chỉ</h4>
                </Form.Label>
                <Form.Control
                    value={
                        user?.address.add +
                        ', ' +
                        user?.address.ward.name +
                        ', ' +
                        user?.address.district.name
                    }
                    disabled
                    style={{
                        fontSize: '1.5rem',
                        backgroundColor: '#ccc',
                        boxShadow:
                            '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    }}
                />
            </FormGroup>
        </div>
    )
}

const Checkout = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    const getUser = () => {
        const currentUser = JSON.parse(localStorage.getItem('user'))
        if (currentUser) {
            if (
                !currentUser?.address ||
                !currentUser?.address?.add ||
                !currentUser?.address?.ward?.code ||
                !currentUser?.address?.district?.code
            ) {
                notification.error({
                    message: 'Address',
                    description: 'Please try again',
                })
                navigate('/profile')
            }
            if (!currentUser?.phoneNumber) {
                notification.error({
                    message: 'Phone number',
                    description: 'Please try again',
                })
                navigate('/profile')
            }
            setUser(currentUser)
        } else navigate('/login')
    }

    const getItem = () => {
        const items = JSON.parse(localStorage.getItem('items'))
        if (!items || items.length <= 0) navigate('/')
    }

    useEffect(() => {
        getUser()
        getItem()
        return () => {
            setUser(null)
        }
    }, [])

    return (
        <div>
            <h1>Check out</h1>
            <Row>
                <Col span={9} offset={1}>
                    <Contact user={user} />
                </Col>
                <Col span={13} offset={1}>
                    <h1 style={{ textAlign: 'center' }}>Thông tin đơn hàng</h1>
                    <CartCheckout />
                </Col>
            </Row>
        </div>
    )
}

export default Checkout
