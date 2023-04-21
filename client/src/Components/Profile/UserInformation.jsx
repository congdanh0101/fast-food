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

    const [districtChange, setDistrictChange] = useState(false)

    const [fullName, setFullName] = useState(user.fullName)
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber)
    const [gender, setGender] = useState(user.gender)
    const [dob, setDOB] = useState(user.dob)
    const [email, setEmail] = useState(user.email)
    const [address, setAddress] = useState(user.address || '')
    const [userDistrict, setUserDistrict] = useState(user.address?.district)
    const [userWard, setUserWard] = useState(user.address?.ward)

    const [ghnDistrict, setGHNDistrict] = useState([])

    const [ghnWard, setGHNWard] = useState([] || ghnDistrict[0].DistrictID)

    // const [districtList, setDistrictList] = useState(
    //     JSON.parse(localStorage.getItem('districtList'))
    // )
    // const [wardList, setWardList] = useState(
    //     JSON.parse(localStorage.getItem('wardList'))
    // )

    const [currentWard, setCurrentWard] = useState(
        JSON.parse(localStorage.getItem('currentWard')) || {}
    )

    const [idDistrict, setIdDistrict] = useState(
        user.address?.district?.code || localStorage.getItem('idDistrict')
    )
    const [idWard, setIdWard] = useState(user.address?.ward?.code)

    const fetchDistrictGHN = async () => {
        try {
            const resp = await fetch(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=202`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: 'eab201ba-816f-11ed-a2ce-1e68bf6263c5',
                    },
                }
            )

            const resjson = await resp.json()
            const data = resjson.data
            data.splice(0, 3)
            data[3].NameExtension = ['Quận Thủ Đức']
            setGHNDistrict(data)
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const fetchWardGHN = async (value = idDistrict) => {
        try {
            const resp = await fetch(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${value}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: 'eab201ba-816f-11ed-a2ce-1e68bf6263c5',
                    },
                }
            )
            const resjson = await resp.json()
            let data = resjson.data
            data = data.filter((ward) => ward.NameExtension)
            setGHNWard(data)
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDistrictData = async () => {
        const endpointDistrict =
            'https://api.mysupership.vn/v1/partner/areas/district?province=79'
        try {
            const response = await axios.get(endpointDistrict, {
                withCredentials: false,
            })
            localStorage.setItem(
                'districtList',
                JSON.stringify(response.data.results)
            )
            // setDistrictList(response.data.results)
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
            localStorage.setItem(
                'wardList',
                JSON.stringify(response.data.results)
            )
            // setWardList(response.data.results)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDistrictGHN()
        // fetchDistrictData()
        // fetchWardData()
        return () => setGHNDistrict([])
    }, [])

    useEffect(() => {
        fetchWardGHN()
        // fetchWardData()
        return () => setGHNWard([])
    }, [idDistrict])

    const handleUpdateData = () => {
        console.log(phoneNumber)
        console.log(dob)
    }
    const handleDistrictChange = (e) => {
        localStorage.setItem('idDistrict', e)

        setDistrictChange(true)
        setIdDistrict(e)
        fetchWardGHN(e).then((data) => {
            console.log(data[0])
            localStorage.setItem('idWard', data[0].WardCode)
            localStorage.setItem(
                'currentWard',
                JSON.stringify({
                    value: data[0].WardCode,
                    label: data[0].WardName,
                })
            )
            setCurrentWard({
                value: data[0].WardCode,
                label: data[0].WardName,
            })
            setIdWard(data[0].WardCode)
        })
    }

    const handleWardChange = (e) => {
        localStorage.setItem('idWard', e)
        fetchWardGHN(idDistrict).then((data) => {
            const current = data.find((ward) => ward.WardCode.toString() === e)
            localStorage.setItem(
                'currentWard',
                JSON.stringify({
                    value: current.WardCode,
                    label: current.WardName,
                })
            )
            setCurrentWard({
                value: current.WardCode,
                label: current.WardName,
            })
        })
        setIdWard(e)
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
                                {user.dob ? (
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
                                defaultValue={address?.add}
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
                                <Select
                                    onChange={handleDistrictChange}
                                    // style={{ width: '200%' }}
                                    // options={ghnDistrict?.map((district) => ({
                                    //     value: district.DistrictID,
                                    //     label: district.NameExtension[0],
                                    // }))}
                                    defaultValue={
                                        userDistrict?.name ||
                                        ghnDistrict?.find((d) => {
                                            return (
                                                d.DistrictID.toString() ===
                                                localStorage.getItem(
                                                    'idDistrict'
                                                )
                                            )
                                        })?.NameExtension[0]
                                    }
                                >
                                    {ghnDistrict?.map((district) => (
                                        <Select.Option
                                            key={district.DistrictID}
                                        >
                                            {district.NameExtension[0]}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6} offset={1}>
                            <FormLabel>ward</FormLabel>

                            <Form.Item
                                name="ward"
                                // label="Ward"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your ward!',
                                    },
                                ]}
                            >
                                {/* <Space wrap> */}
                                <Select
                                    onChange={handleWardChange}
                                    // style={{ width: '200%' }}
                                    defaultValue={
                                        userWard?.name ||
                                        ghnWard?.find(
                                            (w) =>
                                                w.WardCode.toString() ===
                                                localStorage.getItem('idWard')
                                                    ?.WardName
                                        )
                                    }
                                    options={ghnWard?.map((ward) => ({
                                        value: ward.WardCode,
                                        label: ward.WardName,
                                    }))}
                                    // value={userWard?.name}
                                    // value={ghnWard?.find(
                                    //     (w) =>
                                    //         w.WardCode.toString() ===
                                    //         localStorage.getItem('idWard')
                                    //             ?.WardName
                                    // )}
                                    value={currentWard.label}
                                />
                                {/* </Space> */}
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
