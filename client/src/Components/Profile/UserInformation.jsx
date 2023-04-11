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
} from '@ant-design/icons'
import { useState } from 'react'
import { FormLabel } from 'react-bootstrap'

const UserInformation = (props) => {
    const [form] = Form.useForm()

    const validatePhoneNumber = (rule, value) => {
        const phoneNumberRegex = /^[0-9]{10}$/ // match 10 digits
        if (value && !phoneNumberRegex.test(value)) {
            return Promise.reject('Phone number must be 10 digits')
        }
        return Promise.resolve()
    }

    return (
        <div>
            <Row justify="center" align="middle" style={{ width: '100%' }}>
                <Col>
                    <div style={{ textAlign: 'center' }}>
                        <Form
                            form={form}
                            style={{ width: '100%', marginTop: '2rem' }}
                        >
                            <Row gutter={[24, 16]}
                            style={{width:'100%'}}>
                                {/* <Col span={4}>
                                    <FormLabel style={{ fontSize: '150%' }}>
                                        Full name
                                    </FormLabel>
                                </Col> */}
                                <Col span={12}>
                                    {/* <FormLabel style={{ fontSize: '150%' }}>
                                        Full name
                                    </FormLabel> */}
                                    <Form.Item
                                        name="fullName"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please enter your full name',
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Full Name"
                                            type="text"
                                            defaultValue={props.name}
                                            style={{ fontSize: '1.25rem' }}
                                        />
                                    </Form.Item>
                                </Col>
                                {/* <Col span={4}>
                                    <FormLabel style={{ fontSize: '150%' }}>
                                        Full name
                                    </FormLabel>
                                </Col> */}
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
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
                                        />
                                    </Form.Item>
                                </Col>
                                {/* <Col span={4}>
                                    <FormLabel style={{ fontSize: '150%' }}>
                                        Gender
                                    </FormLabel>
                                </Col> */}
                                <Col span={12}>
                                    <Form.Item
                                        style={{ width: '100%' }}
                                        name="gender"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please select your gender!',
                                            },
                                        ]}
                                    >
                                        {/* <Select
                                            placeholder="Select your gender"
                                            style={{
                                                width: '100%',
                                                fontSize: '200%',
                                            }}
                                        >
                                            <Select.Option
                                                value="male"
                                                style={{ fontSize: '150%' }}
                                            >
                                                Male
                                            </Select.Option>
                                            <Select.Option
                                                value="female"
                                                style={{ fontSize: '150%' }}
                                            >
                                                Female
                                            </Select.Option>
                                        </Select> */}
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Full Name"
                                            type="text"
                                            defaultValue={props.name}
                                            style={{ fontSize: '1.25rem' }}
                                            disabled
                                        />
                                    </Form.Item>
                                </Col>
                                {/* <Col span={4}>
                                    <FormLabel style={{ fontSize: '150%' }}>
                                        DOB
                                    </FormLabel>
                                </Col> */}
                                <Col span={12}>
                                    <Form.Item
                                        style={{ height: '75%' }}
                                        name="dob"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please select your date of birth!',
                                            },
                                        ]}
                                    >
                                        {/* <DatePicker
                                            format="MM/DD/YYYY"
                                            placeholder="Select your date of birth"
                                            style={{
                                                width: '100%',
                                                fontSize: '150%',
                                                height: '100%',
                                            }}
                                        /> */}
                                        <Input
                                            type="date"
                                            style={{
                                                width: '100%',
                                                fontSize: '150%',
                                            }}
                                            onSelect={(e) => {
                                                const date = new Date(
                                                    e.target.value
                                                )
                                                const dob = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`
                                                console.log(dob)
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* <Row gutter={[48, 24]}>
                                <Col span={12}>
                                    <Form.Item
                                        name="gender"
                                        label="Gender"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please select your gender!',
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Select your gender">
                                            <Select.Option value="male">
                                                Male
                                            </Select.Option>
                                            <Select.Option value="female">
                                                Female
                                            </Select.Option>
                                            <Select.Option value="other">
                                                Other
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        style={{ height: '75%' }}
                                        name="dob"
                                        label="Date of Birth"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please select your date of birth!',
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            format="MM/DD/YYYY"
                                            placeholder="Select your date of birth"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row> */}
                            {/* <FormLabel>Full name</FormLabel>
                            <Form.Item
                                name="fullName"
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
                                    defaultValue={props.name}
                                    style={{ fontSize: '1.25rem' }}
                                />
                            </Form.Item> */}
                            <Row gutter={[24, 16]}></Row>
                            <FormLabel>Email</FormLabel>
                            <br />
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter your email address',
                                    },
                                    {
                                        type: 'email',
                                        message:
                                            'Please enter a valid email address',
                                    },
                                ]}
                                style={{ width: '100%' }}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Email Address"
                                    defaultValue={props.email}
                                    style={{ fontSize: '1.25rem' }}
                                    disabled
                                />
                            </Form.Item>
                            {/* <label htmlFor="">Phone Number</label>
                            <Form.Item
                                name="phone"
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
                                />
                            </Form.Item> */}
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default UserInformation
