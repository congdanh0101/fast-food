import {
    Avatar,
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Menu,
    Radio,
    Row,
    Select,
    Space,
    Typography,
} from 'antd'
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    InfoCircleOutlined,
    PlusCircleOutlined,
    PhoneOutlined,
    TransactionOutlined,
    HeartOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { FormLabel } from 'react-bootstrap'
import axios from 'axios'
require('dotenv').config()
const UserInformation = ({ user }) => {
    const [form] = Form.useForm()

    const validatePhoneNumber = (rule, value) => {
        const phoneNumberRegex = /^[0-9]{10}$/ // match 10 digits
        if (value && !phoneNumberRegex.test(value)) {
            return Promise.reject('Phone number must be 10 digits')
        }
        return Promise.resolve()
    }

    const [fullName, setFullName] = useState(user.fullName)
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber)
    const [gender, setGender] = useState(user.gender)
    const [dob, setDOB] = useState(user.dob)
    const [email, setEmail] = useState(user.email)
    const [address, setAddress] = useState(user.address)

    const [districtList, setDistrictList] = useState(
        JSON.parse(localStorage.getItem('districtList')) || []
    )
    const [wardList, setWardList] = useState(
        JSON.parse(localStorage.getItem('wardList')) || []
    )

    const [idDistrict, setIdDistrict] = useState()
    const [idWard, setIdWard] = useState()

    const fetchDistrictData = async () => {
        const endpointDistrict =
            'https://api.mysupership.vn/v1/partner/areas/district?province=79'

        try {
            const response = await axios.get(endpointDistrict, {
                withCredentials: false,
            })
            localStorage.setItem('districtList', JSON.stringify(response.data.results))
            setDistrictList(response.data.results)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchWardData = async () => {
        const endpointWard =
            'https://api.mysupership.vn/v1/partner/areas/commune?district='
        try {
            const response = await axios.get(endpointWard + `${idDistrict}`, {
                withCredentials: false,
            })
            localStorage.setItem('wardList', JSON.stringify(response.data.results))
            setWardList(response.data.results)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDistrictData()
    }, [])

    useEffect(() => {
        fetchWardData()
    }, [idDistrict])

    const handleUpdateData = () => {}
    const handleDistrictChange = (e) => {
        localStorage.setItem('idDistrict', e)
        setIdDistrict(e)
    }
    return (
        <div>
            <Row align="middle" justify="start">
                <Col span={16} offset={8}>
                    <Row>
                        <Col span={6}>
                            <Form.Item
                                name="fullName"
                                label="Full name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your full name',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Full Name"
                                    type="text"
                                    defaultValue={fullName}
                                    style={{ fontSize: '1.25rem' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6} offset={1}>
                            <Form.Item
                                name="phone"
                                label="Phone number"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your phone number!',
                                    },
                                    {
                                        validator: validatePhoneNumber,
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="Phone number"
                                    // defaultValue={props.email}
                                    style={{ fontSize: '1.25rem' }}
                                    defaultValue={phoneNumber}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={16} offset={8}>
                    <Row>
                        <Col span={6}>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your full name',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<HeartOutlined />}
                                    placeholder="Gender"
                                    // defaultValue={props.email}
                                    style={{ fontSize: '1.25rem' }}
                                    defaultValue={gender ? `MALE` : `FEMALE`}
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6} offset={1}>
                            <Form.Item
                                name="dob"
                                label="Date of birth"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your phone number!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<HeartOutlined />}
                                    placeholder="Phone number"
                                    // defaultValue={props.email}
                                    style={{ fontSize: '1.25rem' }}
                                    type="date"
                                    disabled={dob ? true : false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={9} offset={8}>
                    <Col span={23}>
                        <FormLabel>Email:</FormLabel>
                        <Form.Item
                            name="dob"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email"
                                // defaultValue={props.email}
                                style={{ fontSize: '1.25rem' }}
                                type="text"
                                defaultValue={email}
                                disabled
                            />
                        </Form.Item>
                    </Col>
                </Col>
                <Col span={9} offset={8}>
                    <Col span={23}>
                        <FormLabel>Address</FormLabel>
                        <Form.Item
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Address"
                                // defaultValue={props.email}
                                style={{ fontSize: '1.25rem' }}
                                type="text"
                                defaultValue={address}
                            />
                        </Form.Item>
                    </Col>
                </Col>
                <Col span={16} offset={8}>
                    <Row>
                        <Col span={6}>
                            <Form.Item
                                name="district"
                                label="District"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your full name',
                                    },
                                ]}
                            >
                                <Space wrap>
                                    <Select
                                        onChange={handleDistrictChange}
                                        style={{ width: '150px' }}
                                        options={districtList?.map(
                                            (district) => ({
                                                value: district.code,
                                                label: district.name,
                                            })
                                        )}
                                        defaultValue={
                                            districtList.find(
                                                (d) =>
                                                    d.code ==
                                                    localStorage.getItem(
                                                        'idDistrict'
                                                    )
                                            )?.name
                                        }
                                    >
                                        {/* {districtList?.map((district) => (
                                            <Select.Option
                                                value={district.code}
                                            >
                                                {district.name}
                                            </Select.Option>
                                        ))} */}
                                    </Select>
                                </Space>
                            </Form.Item>
                        </Col>

                        <Col span={6} offset={1}>
                            <Form.Item
                                name="ward"
                                label="Ward"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your phone number!',
                                    },
                                ]}
                            >
                                <Space wrap>
                                    <Select
                                        onChange={(e) => {
                                            localStorage.setItem('idWard', e)
                                            setIdWard(e)
                                        }}
                                        style={{ width: '170px' }}
                                    >
                                        {wardList?.map((ward) => (
                                            <Select.Option value={ward.code}>
                                                {ward.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={16} offset={8}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            fontSize: '1.5rem',
                            height: '125%',
                            width: '20%',
                        }}
                        onClick={handleUpdateData}
                    >
                        Updated
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default UserInformation
