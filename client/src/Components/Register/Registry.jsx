import React, { useState } from 'react'
import { Form, Input, Button, DatePicker, Select } from 'antd'
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LockOutlined,
} from '@ant-design/icons'
import { registerUser } from '../../redux/apiRequest'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

const RegisterForm = () => {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [dob, setDOB] = useState('')
    const [gender, setGender] = useState(true)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [address, setAddress] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSelect = (value) => {
        console.log(`Selected ${value}`)
        setGender(value)
    }

    const handleSubmit = async (values) => {
        setIsLoading(true)

        // Call backend API to register user with the provided information
        // ...

        const userRegister = {
            email: email,
            fullName: fullName,
            password: password,
            confirmPassword: confirmPassword,
        }
        console.log(userRegister)
        registerUser(userRegister, dispatch, navigate)

        setIsLoading(false)
    }

    return (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
                name="fullname"
                rules={[
                    { required: true, message: 'Please enter your full name' },
                ]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder="Full Name"
                    onChange={(e) => setFullName(e.target.value)}
                />
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
                <Input
                    prefix={<MailOutlined />}
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
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
                    onChange={(e) => setPassword(e.target.value)}
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    block
                >
                    Register
                </Button>
            </Form.Item>
        </Form>
    )
}

export default RegisterForm
