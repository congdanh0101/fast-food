import React, { useState } from 'react'
import { Form, Input, Button, Row, Col, Select } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { registerUser } from '../../redux/apiRequest'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import '../../dist/output.css'
const bcrypt = require('bcryptjs')
const RegisterForm = () => {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (values) => {
        setIsLoading(true)
        values['password'] = bcrypt.hashSync(values['password'], 10)
        values['confirmPassword'] = values['password']
        console.log(values['password'])
        console.log(values['confirmPassword'])

        try {
            registerUser(values, dispatch, navigate)
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }

    return (
        <Row justify="center" align="middle">
            <Col>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '75%',
                        transform: 'scale(1.5)',
                    }}
                >
                    <Form.Item
                        style={{ flex: '1' }}
                        label="Họ và tên"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập họ tên',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Họ tên"
                        />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy chọn giới tính!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn giới tính"
                            style={{ width: '125%' }}
                        >
                            <Select.Option></Select.Option>
                            <Select.Option value={true}>Male</Select.Option>
                            <Select.Option value={false}>Female</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        style={{ flex: '1' }}
                        name="email"
                        label="Địa chỉ eamil"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập email',
                            },
                            {
                                type: 'email',
                                message: 'Hãy nhập email hợp lệ',
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Địa chỉ email"
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ flex: '1' }}
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập mật khẩu',
                            },
                            {
                                min: 6,
                                message:
                                    'Mật khẩu phải chứa ít nhất 6 kí tự',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ flex: '1' }}
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy xác nhận mật khẩu',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        new Error('Mật khẩu không khớp')
                                    )
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Xác nhận mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            style={{ width: '150%' }}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}

export default RegisterForm
