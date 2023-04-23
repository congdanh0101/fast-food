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
    notification,
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
import SelectWard from './SelectWard'
import SelectDistrict from './SelectDistrict'
import axiosInstance from '../../utils/axiosInstance'
import request from '../../utils/axiosConfig'
require('dotenv').config()

const UserInfo = () => {
    const [form] = Form.useForm()

    const [load, setLoad] = useState(true)

    const validatePhoneNumber = (rule, value) => {
        const phoneNumberRegex = /^[0-9]{10}$/ // match 10 digits
        if (value && !phoneNumberRegex.test(value)) {
            return Promise.reject('Phone number must be 10 digits')
        }
        return Promise.resolve()
    }

    const [districtChange, setDistrictChange] = useState(false)
    const [currentUser,setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [fullName, setFullName] = useState(currentUser.fullName)
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber)
    const [gender, setGender] = useState(currentUser.gender)
    const [dob, setDOB] = useState(currentUser.dob)
    const [email, setEmail] = useState(currentUser.email)
    const [address, setAddress] = useState(currentUser.address?.add || '')
    const [userDistrict, setUserDistrict] = useState(currentUser.address?.district)
    const [userWard, setUserWard] = useState(currentUser.address?.ward)
    const [idDistrict, setIdDistrict] = useState(currentUser.address?.district?.code)

    const handleUpdateData = async () => {
        try {
            const updateResponse = await axiosInstance.put('/user', {
                fullName: fullName,
                phoneNumber: phoneNumber,
                dob: dob,
                address: {
                    add: address,
                    district: {
                        code: userDistrict.code.toString(),
                        name: userDistrict.name,
                    },
                    ward: {
                        code: userWard.code.toString(),
                        name: userWard.name,
                    },
                },
            })

            localStorage.setItem('user', JSON.stringify(updateResponse.data))
            setCurrentUser(updateResponse.data)
            setAddress(updateResponse.data.address.add)
            setUserDistrict(updateResponse.data.address.district)
            setUserWard(updateResponse.data.address.ward)
            notification.success({
                message: 'Update successfully',
                duration: 3,
            })
            setTimeout(()=>window.location.reload(),700)
        } catch (error) {
            notification.error({
                message: 'Update Failure',
                description: error.response.data.message,
                duration: 3,
            })
        }
    }
    const handleDistrictChange = (e, current) => {
        console.log('current district ', current)
        const currentUserDistrict = {
            code: current.DistrictID,
            name: current.NameExtension[0],
        }
        setUserDistrict(currentUserDistrict)
        setIdDistrict(e)
        setLoad(false)
        setDistrictChange(true)
    }

    const handleWardChange = (e) => {
        console.log('ward ', e)
        const userCurrentWard = {
            code: e.WardCode,
            name: e.NameExtension[0],
        }
        setUserWard(userCurrentWard)
    }
    return (
        <div
            style={{
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center',
                // minHeight: '100vh',
                width: '105%',
            }}
        >
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
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
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
                                    style={{ fontSize: '1.25rem' }}
                                    defaultValue={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
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
                                            'Please input your date of birth!',
                                    },
                                ]}
                            >
                                {currentUser.dob ? (
                                    <>
                                        <Input
                                            prefix={<HeartOutlined />}
                                            placeholder="Date of birth"
                                            // defaultValue={props.email}
                                            style={{ fontSize: '1.25rem' }}
                                            disabled
                                            defaultValue={`${new Date(
                                                dob
                                            ).getDate()}/${
                                                new Date(dob).getMonth() + 1
                                            }/${new Date(dob).getFullYear()}`}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            prefix={<HeartOutlined />}
                                            placeholder="Date of birth"
                                            // defaultValue={props.email}
                                            style={{ fontSize: '1.25rem' }}
                                            onChange={(e) =>
                                                setDOB(e.target.value)
                                            }
                                            type="date"
                                        />
                                    </>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={9} offset={8}>
                    <Col span={23}>
                        <FormLabel>Email:</FormLabel>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
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
                                    message: 'Please input your address!',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Address"
                                // defaultValue={props.email}
                                style={{ fontSize: '1.25rem' }}
                                type="text"
                                defaultValue={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Col>
                <Col span={16} offset={8}>
                    <Row>
                        <Col span={6}>
                            <FormLabel>District</FormLabel>

                            <Form.Item
                                name="district"
                                // label="District"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your district',
                                    },
                                ]}
                            >
                                <SelectDistrict
                                    defaultValue={userDistrict?.name}
                                    onChange={handleDistrictChange}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6} offset={1}>
                            <FormLabel>ward</FormLabel>
                            <Form.Item
                                name="ward"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your ward!',
                                    },
                                ]}
                            >
                                <SelectWard
                                    district={idDistrict}
                                    defaultValue={userWard?.name}
                                    load={load}
                                    change={districtChange}
                                    onChange={handleWardChange}
                                />
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

export default UserInfo
