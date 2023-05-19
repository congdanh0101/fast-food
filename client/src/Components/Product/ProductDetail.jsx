import { createContext, useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Menu,
    Row,
    Select,
    Slider,
    notification,
} from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { QuantityPicker } from 'react-qty-picker'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartContext from '../../context/CartContext'
// import { Form, FormGroup } from 'react-bootstrap'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
import Sider from 'antd/es/layout/Sider'
import { ProductCard } from './ProductList'
import { Card } from 'react-bootstrap'
import { ProductList } from '../Cart/CartClone'
const defaultFonts = [
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Impact',
    'Georgia',
    'Tahoma',
    'Trebuchet MS',
    'Verdana',
]
const ProductDetail = () => {
    const context = useContext(CartContext)
    const [product, setProduct] = useState({})
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [items, setItems] = useState([])
    const [description, setDescription] = useState('')
    const id = useParams()
    const [listCategory, setListCategory] = useState([])
    const [listMustTryProduct, setListMustTryProduct] = useState([])

    const [categoryUpdate, setCategoryUpdate] = useState(product.category?._id)
    const [priceUpdate, setPriceUpdate] = useState(product.price)
    const [nameUpdate, setNameUpdate] = useState(product.name)

    const [selectMustTry, setSelectMustTry] = useState([])

    const sortedFontOptions = [
        'Logical',
        'Salesforce Sans',
        'Garamond',
        'Sans-Serif',
        'Serif',
        'Times New Roman',
        'Helvetica',
        ...defaultFonts,
    ].sort()

    // console.log(description)

    const fetchDataMustTry = async () => {
        try {
            const response = await request.get(
                `/product?category=63f0add10207afdbe49f43ea&softDeleted=false`
            )
            setListMustTryProduct(response.data)
            const dataSelect = []
            for (var i = 0; i < response.data.length; i++) {
                dataSelect.push({
                    product: response.data[i],
                    quantity: 0,
                })
            }
            setSelectMustTry(dataSelect)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDataProduct = async () => {
        const p = await request.get(`/product/${id.id}`)
        const data = p.data
        setProduct(data)
        setDescription(p.description)
        setPrice(
            data['price'].toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
            })
        )
        setNameUpdate(data['name'])
        setCategoryUpdate(data['category']['_id'])
    }
    const fetchCategoryList = async () => {
        try {
            const response = await request.get('/category')
            setListCategory(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddToCart = (e) => {
        let item = { product: product, quantity: quantity }
        var cloneSelect = [...selectMustTry]
        cloneSelect.push(item)
        cloneSelect = cloneSelect.filter((i) => i.quantity !== 0)
        console.log(cloneSelect)
        let existingItems = JSON.parse(localStorage.getItem('items')) || []
        const updatedExist = [...existingItems]

        debugger
        for (const selectedProduct of cloneSelect) {
            const existingProductIndex = updatedExist.findIndex(
                (existingProduct) =>
                    existingProduct.product._id === selectedProduct.product._id
            )
            if (existingProductIndex !== -1) {
                // Product already exists, update the quantity
                updatedExist[existingProductIndex].quantity +=
                    selectedProduct.quantity
            } else {
                // Product does not exist, add it to the array
                updatedExist.push(selectedProduct)
            }
        }

        const isDuplicate = existingItems.find(
            (it) => it.product._id === item.product._id
        )
        // duplicate
        // if (isDuplicate) {
        //     existingItems.forEach((it) =>
        //         it.product._id === item.product._id
        //             ? (it.quantity += item.quantity)
        //             : it.quantity
        //     )
        //     localStorage.setItem('items', JSON.stringify(existingItems))
        //     setItems(existingItems)
        // } else {
        //     localStorage.setItem(
        //         'items',
        //         JSON.stringify([...existingItems, item])
        //     )
        //     context.getCountItem()
        //     setItems([...existingItems, item])
        // }

        localStorage.setItem('items', JSON.stringify(updatedExist))
        context.getCountItem()
        setItems(items)

        notification.success({
            message: 'Add to cart successfully',
            duration: 1,
        })
    }

    useEffect(() => {
        fetchDataProduct()
        fetchCategoryList()
        fetchDataMustTry()
        return () => {
            console.log(`clean product by id`)
            setProduct({})
            setListCategory([])
            setListMustTryProduct([])
        }
    }, [id])

    const onChangeMustTryQuantity = (product, index, event) => {
        const cloneSelect = [...selectMustTry]
        cloneSelect[index].quantity = event
        console.log(selectMustTry)
        setSelectMustTry(cloneSelect)
    }

    const isDescriptionEmpty = (content) => {
        const pattern = /^<[^>/]*>(?:\s*<[^>/]*>\s*)*<\/[^>]*>$/
        return pattern.test(content)
    }

    return (
        <div style={{ marginTop: '2.5%' }}>
            <Row>
                {/* <Col span={3}></Col> */}
                <Col span={8} style={{ height: '100%' }}>
                    <img src={product['img']} width={'80%'} height={'100%'} />
                </Col>
                <Col span={8}>
                    <h1 style={{}}>{product.name}</h1>
                    <h2 style={{ color: 'red' }}>{price}</h2>
                    {isDescriptionEmpty(product.description) === false ? (
                        <>
                            <h3 style={{}}>Thông tin sản phẩm</h3>
                            <div style={{}}>
                                {ReactHtmlParser(product.description)}
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                    <br />
                    <div>
                        <h2 style={{}}>Số lượng</h2>
                        <br />
                        <QuantityPicker
                            onChange={(value) => setQuantity(value)}
                            min={1}
                            value={quantity}
                            max={99}
                            smooth
                        />
                    </div>
                    <div>
                        <Button
                            type="primary"
                            style={{
                                height: '200%',
                                fontSize: '1.5rem',
                            }}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCartOutlined />
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </Col>
                <Col span={8} style={{ width: '50%' }}>
                    <h1>Phai thu</h1>
                    {/* {listMustTryProduct?.map((item) => (
                        <>
                            <ProductList products={listMustTryProduct}/>
                        </>
                    ))} */}
                    {/* <ProductList products={listMustTryProduct} /> */}
                    {/* <img src={product['img']} style={{width:'25%'}}/> */}
                    <ProductCardMustTry
                        item={listMustTryProduct}
                        onChangeMustTryQuantity={onChangeMustTryQuantity}
                    />
                </Col>
            </Row>
        </div>
    )
}

const ProductCardMustTry = ({ item, onChangeMustTryQuantity }) => {
    return (
        <div>
            <section className="container">
                <ul className="products">
                    {item.map((product, index) => {
                        return (
                            <li className="row" key={index}>
                                <div className="col left">
                                    <div className="thumbnail">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className="detail">
                                        <div className="name">
                                            <h4>{product.name}</h4>
                                        </div>
                                        <div className="description"></div>
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
                                                {formatCurrency(product.price)}
                                            </span>{' '}
                                        </div>
                                    </div>
                                </div>

                                <div className="col right">
                                    <div className="quantity">
                                        <QuantityPicker
                                            onChange={(event) => {
                                                onChangeMustTryQuantity(
                                                    product,
                                                    index,
                                                    event
                                                )
                                            }}
                                            min={0}
                                            value={0}
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
        </div>
    )
}

function formatCurrency(value) {
    return Number(value).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
    })
}

export default ProductDetail
