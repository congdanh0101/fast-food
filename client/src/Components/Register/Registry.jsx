import React, { useState } from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
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
            localStorage.setItem('registerUser', JSON.stringify(values))
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
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ flex: '1' }}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your email address',
                            },
                            {
                                type: 'email',
                                message: 'Please enter a valid email address',
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email Address"
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ flex: '1' }}
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password',
                            },
                            {
                                min: 6,
                                message:
                                    'Password must be at least 6 characters long',
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
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password',
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
                                        new Error('Passwords do not match')
                                    )
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            style={{ width: '150%' }}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}

export default RegisterForm
