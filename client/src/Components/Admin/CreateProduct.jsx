import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import request from '../../utils/axiosConfig'
import {
    Button,
    Col,
    Input,
    Row,
    Select,
    Spin,
    message,
    notification,
} from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { QuantityPicker } from 'react-qty-picker'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartContext from '../../context/CartContext'
// import { Form, FormGroup } from 'react-bootstrap'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
import { FormGroup, Form } from 'react-bootstrap'
import axiosInstance from '../../utils/axiosInstance'

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

const CreateProduct = () => {
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [listCategory, setListCategory] = useState([])
    const [name, setName] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectCategory, setSelectCategory] = useState(null)
    const [selectCombo, setSelectCombo] = useState(false)
    const [comboCategory, setComboCategory] = useState(null)
    const [loading, setLoading] = useState(false)
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

    const fetchCategory = async () => {
        try {
            const response = await request.get('/category')
            setListCategory(response.data)
            response.data.forEach((element) => {
                if (element['name'] === 'Combo')
                    setComboCategory(element['_id'])
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategory()

        return () => {
            setListCategory([])
        }
    }, [])

    const handleImageDrop = (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)

        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png'
        ) {
            setSelectedImage(file)
            notification.success({
                message: 'Upload successfully',
            })
        } else {
            notification.error({
                message: 'Upload failed',
                description: 'Only upload JPEG/JPG/PNG image',
            })
        }
    }

    const handleAddProduct = async () => {
        if (
            name === null ||
            name === '' ||
            price === 0 ||
            price === '' ||
            selectedImage === null ||
            selectedImage === '' ||
            selectCategory === null ||
            selectCategory === ''
        )
            notification.error({
                message: 'Add new product failed',
                description: 'Please enter all field!',
            })
        else
            try {
                const formData = new FormData()
                setLoading(true)
                formData.append('name', name)
                formData.append('category', selectCategory)
                formData.append('description', description)
                formData.append('img', selectedImage)
                formData.append('price', price)
                const response = await axiosInstance.post(
                    '/product',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
                setLoading(false)
                notification.success({
                    message: 'Add new product successfully',
                })
            } catch (error) {
                console.log(error)
                notification.error({
                    message: 'Add new product failed',
                    description: error.response?.data.message,
                })
            }
    }

    return (
        <div>
            <Spin spinning={loading}>
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
                                src={null}
                                width={'70%'}
                                height={'120%'}
                                alt="Selected image"
                            />
                        )}
                    </Col>
                    <Col span={10} style={{ marginTop: '5%' }}>
                        <FormGroup
                            style={{ width: '100%', fontSize: '1.5rem' }}
                        >
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Input
                                type="text"
                                value={name}
                                style={{ fontSize: '1.25rem' }}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <br />
                            <Form.Label>Đơn giá</Form.Label>
                            <Input
                                type="number"
                                value={price}
                                style={{ fontSize: '1.25rem' }}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <br />
                            <Form.Label>Loại sản phẩm</Form.Label>
                            <Select
                                style={{ width: '100%', height: '100%' }}
                                options={listCategory?.map((item) => ({
                                    value: item['_id'],
                                    label: item['name'],
                                }))}
                                value={selectCategory}
                                onChange={(e) => {
                                    setSelectCategory(e)
                                    console.log(e)
                                    if (e === comboCategory) console.log(true)
                                }}
                            ></Select>

                            <Form.Label>Tải hình ảnh</Form.Label>
                            <br />
                            {/* <input type="file" onChange={(e) => console.log(e)} /> */}
                            <Input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleImageDrop}
                                style={{ width: '50%', cursor: 'pointer' }}
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
                                onClick={handleAddProduct}
                            >
                                Xac nhan
                            </Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Spin>
        </div>
    )
}

export default CreateProduct
