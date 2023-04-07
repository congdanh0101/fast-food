import React, { useState } from 'react'
import { Form, Input, Button, DatePicker, Select } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { registerUser } from '../../redux/apiRequest'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import '../../dist/output.css'

const RegisterForm = () => {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (values) => {
        setIsLoading(true)
        registerUser(values, dispatch, navigate)
        setIsLoading(false)
    }

    return (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
                name="fullName"
                rules={[
                    { required: true, message: 'Please enter your full name' },
                ]}
            >
                <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>

            <Form.Item
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
                <Input prefix={<MailOutlined />} placeholder="Email Address" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Please enter your password' },
                    {
                        min: 6,
                        message: 'Password must be at least 6 characters long',
                    },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
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
                    block
                    // style={{ width: 200 }}
                >
                    Register
                </Button>
            </Form.Item>
        </Form>
    )
}

export default RegisterForm
