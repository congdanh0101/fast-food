import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import { Button, Col, Form, Input, Row, Select, notification } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { QuantityPicker } from 'react-qty-picker'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartContext from '../../context/CartContext'
// import { Form, FormGroup } from 'react-bootstrap'
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

export default function EditProduct() {
    const context = useContext(CartContext)
    const [product, setProduct] = useState({})
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const id = useParams()
    const [listCategory, setListCategory] = useState([])

    const [categoryUpdate, setCategoryUpdate] = useState(null)
    const [priceUpdate, setPriceUpdate] = useState(null)
    const [nameUpdate, setNameUpdate] = useState(null)

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
        setDescription(data['description'])
        setPrice(
            data['price'].toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
            })
        )
        // setPriceUpdate(pro)
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
                    <Form.Item>
                        <Input
                            type="text"
                            value={nameUpdate}
                            style={{ fontSize: '1.25rem' }}
                            placeholder="product name"
                            onChange={(e) => setNameUpdate(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Input
                            type="text"
                            value={price}
                            style={{ fontSize: '1.25rem' }}
                            placeholder="product name"
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <input type="file" onChange={(e) => console.log(e)} />
                    </Form.Item>

                    <br></br>
                    <br></br>
                    <SunEditor
                        // defaultValue={product.description}
                        setContents={description}
                        onChange={(e) => {
                            console.log(e)
                            setDescription(e)
                        }}
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
                </Col>
            </Row>
        </div>
    )
}
