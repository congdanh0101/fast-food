import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import { Button, Col, Input, Row, Select, notification } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { QuantityPicker } from 'react-qty-picker'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartContext from '../../context/CartContext'
import { Form, FormGroup } from 'react-bootstrap'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
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

    const [categoryUpdate, setCategoryUpdate] = useState('')
    const [priceUpdate, setPriceUpdate] = useState(0)
    const [nameUpdate, setNameUpdate] = useState('')

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
        let existingItems = JSON.parse(localStorage.getItem('items')) || []
        const isDuplicate = existingItems.find(
            (it) => it.product._id === item.product._id
        )
        // duplicate
        if (isDuplicate) {
            existingItems.forEach((it) =>
                it.product._id === item.product._id
                    ? (it.quantity += item.quantity)
                    : it.quantity
            )
            localStorage.setItem('items', JSON.stringify(existingItems))
            setItems(existingItems)
        } else {
            localStorage.setItem(
                'items',
                JSON.stringify([...existingItems, item])
            )
            context.getCountItem()
            setItems([...existingItems, item])
        }
        notification.success({
            message: 'Add to cart successfully',
            duration: 1,
        })
    }

    useEffect(() => {
        fetchDataProduct()
        fetchCategoryList()
        return () => {
            console.log(`clean product by id`)
            setProduct({})
            setListCategory([])
        }
    }, [id])

    const handleUpdate = async (e) => {
        console.log(e)
        console.log(priceUpdate)
        console.log(categoryUpdate)
        console.log(nameUpdate)
        console.log(description)
        try {
            // const response = await request.put(`/product/${id}`, {
            //     description: description,
            //     price: priceUpdate,
            //     name: nameUpdate,
            //     category: categoryUpdate,
            // })
        } catch (error) {}
    }

    return (
        <div style={{ marginTop: '5%' }}>
            <Row>
                {/* <Col span={3}></Col> */}
                <Col span={10} offset={3}>
                    <img src={product['img']} width={'70%'} height={'120%'} />
                </Col>
                <Col span={10} style={{ marginTop: '5%' }}>
                    {context.isAdmin ? (
                        <>
                            <FormGroup
                                className="mb-3"
                                style={{
                                    fontSize: '1.25rem',
                                }}
                            >
                                <Form.Label>
                                    <h4>Tên sản phẩm</h4>
                                </Form.Label>
                                {/* <Form.Control
                                    value={product.name}
                                    style={{
                                        fontSize: '1.5rem',
                                        backgroundColor: '#ccc',
                                    }}
                                /> */}
                                <Input
                                    // defaultValue={product.name}
                                    placeholder={product.name}
                                    style={{
                                        fontSize: '1.5rem',
                                        backgroundColor: '#ccc',
                                    }}
                                    onChange={(e) =>
                                        setNameUpdate(e.target.value)
                                    }
                                />
                                <Form.Label>
                                    <h4>Giá tiền</h4>
                                </Form.Label>
                                {/* <Form.Control
                                    placeholder={product['price']}
                                    value={product['price']}
                                    style={{
                                        fontSize: '1.5rem',
                                        backgroundColor: '#ccc',
                                    }}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                /> */}
                                <Input
                                    style={{
                                        fontSize: '1.5rem',
                                        backgroundColor: '#ccc',
                                    }}
                                    onChange={(e) =>
                                        // console.log(e.target.value)
                                        setPriceUpdate(e.target.value)
                                    }
                                    placeholder={price}
                                    type="number"
                                ></Input>
                                <Form.Label>
                                    <h4>Loại sản phẩm</h4>
                                </Form.Label>
                                <Form.Select
                                    style={{
                                        fontSize: '1.5rem',
                                        backgroundColor: '#ccc',
                                        width: '50%',
                                    }}
                                    onChange={(e) =>
                                        setCategoryUpdate(e.target.value)
                                    }
                                >
                                    {/* <option value={categoryUpdate} selected>
                                        {product?.category?.name}
                                    </option> */}
                                    {listCategory?.map((item) => (
                                        <option
                                            value={item._id}
                                            // selected={categoryUpdate}
                                        >
                                            {item.name}
                                        </option>
                                    ))}

                                    {/* {listCategory
                                        ?.filter(
                                            (item) =>
                                                item._id !== categoryUpdate
                                        )
                                        ?.map((item) => (
                                            <option value={item._id}>
                                                {item.name}
                                            </option>
                                        ))} */}

                                    {/* <option
                                        selected={categoryUpdate}
                                        value={
                                            listCategory.filter(
                                                (item) =>
                                                    item._id === categoryUpdate
                                            )['_id']
                                        }
                                    >
                                        {
                                            listCategory.filter(
                                                (item) =>
                                                    item._id === categoryUpdate
                                            )['name']
                                        }
                                    </option> */}
                                </Form.Select>
                                {/* <Select value={categoryUpdate}>
                                    {listCategory?.map((item) => (
                                        <Select.Option key={item['_id']}>
                                            {item['name']}
                                        </Select.Option>
                                    ))}
                                </Select> */}
                                {/* <SunEditorCustomize /> */}
                                <br></br>
                                <br></br>
                                <Form.Label>
                                    <h4>Mô tả</h4>
                                </Form.Label>
                                <SunEditor
                                    // defaultValue={product.description}
                                    setContents={description}
                                    onChange={setDescription}
                                    setOptions={{
                                        buttonList: [
                                            ['font', 'fontSize'],
                                            // ['paragraphStyle', 'blockquote'],
                                            [
                                                'bold',
                                                'underline',
                                                'italic',
                                                'strike',
                                                'subscript',
                                                'superscript',
                                            ],
                                            ['fontColor', 'hiliteColor'],
                                            ['align', 'list', 'lineHeight'],
                                            ['outdent', 'indent'],
                                            // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                            // ['imageGallery'], // You must add the "imageGalleryUrl".
                                            // ["fullScreen", "showBlocks", "codeView"],
                                            // ['save', 'template'],
                                            // '/', Line break
                                        ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                        // defaultTag: 'div',
                                        minHeight: '200px',
                                        showPathLabel: false,
                                        font: sortedFontOptions,
                                    }}
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        height: '3rem',
                                        fontSize: '100%',
                                    }}
                                    onClick={handleUpdate}
                                >
                                    Update
                                </Button>
                            </FormGroup>
                        </>
                    ) : (
                        <>
                            <h1 style={{ fontSize: '3rem' }}>{product.name}</h1>
                            <h2 style={{ fontSize: '2.5rem', color: 'red' }}>
                                {price}
                            </h2>
                            <h3 style={{ fontSize: '1.75rem' }}>
                                Thông tin sản phẩm
                            </h3>
                            <div style={{ fontSize: '1.25rem' }}>
                                {ReactHtmlParser(product.description)}
                            </div>
                            <br />
                            <div>
                                <h2 style={{ fontSize: '2rem' }}>Số lượng</h2>
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
                                        height: '5rem',
                                        fontSize: '1.5rem',
                                    }}
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCartOutlined />
                                    Thêm vào giỏ hàng
                                </Button>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default ProductDetail
