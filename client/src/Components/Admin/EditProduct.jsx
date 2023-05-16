import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import { Button, Col, Input, Row, Select, message, notification } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { QuantityPicker } from 'react-qty-picker'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartContext from '../../context/CartContext'
// import { Form, FormGroup } from 'react-bootstrap'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
import { FormGroup, Form } from 'react-bootstrap'
import Dropzone from 'react-dropzone'

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

    const [selectedImage, setSelectedImage] = useState(null)
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
    const handleImageDrop = (e) => {
        // setSelectedImage(URL.createObjectURL(acceptedFiles[0]))
        // setSelectedImage(URL.createObjectURL(e.target.value))
        const file = e.target.files[0]

        const formData = new FormData()
        formData.append('image', file)

        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png'
        ) {
            // const render = new FileReader()
            // render.onloadend = () => {
            //     setSelectedImage(render.result)
            // }
            // render.readAsDataURL(file)
            setSelectedImage(file)
            notification.success({
                message: 'Upload successfully',
            })
        } else {
            notification.error({
                message: 'Upload failed',
            })
        }
    }
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
        setPriceUpdate(data['price'])
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
        console.log(selectedImage)
        const formData = new FormData()
        if (selectedImage !== null) formData.append('img', selectedImage)
        else formData.append('img', product['img'])
        formData.append('description', description)
        formData.append('name', nameUpdate)
        formData.append('price', priceUpdate)
        formData.append('category', categoryUpdate)
        console.log(formData)
        try {
            const response = await request.put(`/product/${id.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            notification.success({
                message: 'Update product successfully',
            })
        } catch (error) {
            notification.error({
                message: 'Update product failed',
                description: error.response?.data?.message,
            })
        }
    }

    return (
        <div style={{ marginTop: '2%' }}>
            <Row>
                {/* <Col span={3}></Col> */}
                <Col span={10} offset={3}>
                    {selectedImage != null ? (
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected"
                            width={'70%'}
                            height={'120%'}
                        />
                    ) : (
                        <img
                            src={product['img']}
                            width={'70%'}
                            height={'120%'}
                        />
                    )}
                </Col>
                <Col span={10} style={{ marginTop: '5%' }}>
                    <FormGroup style={{ width: '100%', fontSize: '1.5rem' }}>
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Input
                            type="text"
                            value={nameUpdate}
                            style={{ fontSize: '1.25rem' }}
                            placeholder="product name"
                            onChange={(e) => setNameUpdate(e.target.value)}
                        />
                        <br />
                        <Form.Label>Đơn giá</Form.Label>
                        <Input
                            type="text"
                            value={priceUpdate}
                            style={{ fontSize: '1.25rem' }}
                            onChange={(e) => setPriceUpdate(e.target.value)}
                        />
                        <br />
                        <Form.Label>Loại sản phẩm</Form.Label>
                        <Select
                            style={{ width: '100%' }}
                            options={listCategory?.map((item) => ({
                                value: item['_id'],
                                label: item['name'],
                            }))}
                            value={categoryUpdate}
                            onChange={setCategoryUpdate}
                        ></Select>

                        <Form.Label>Tải hình ảnh</Form.Label>
                        <br />
                        {/* <input type="file" onChange={(e) => console.log(e)} /> */}
                        <Input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleImageDrop}
                            style={{ width: '50%' }}
                        />
                        <br></br>
                        <Form.Label>Mô tả sản phẩm</Form.Label>
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
                    </FormGroup>
                </Col>
            </Row>
        </div>
    )
}
