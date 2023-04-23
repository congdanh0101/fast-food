import { Button, Col, Form, Input, Row, notification } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
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
import request from '../../utils/axiosConfig'
import axios from 'axios'
import axiosInstance from '../../utils/axiosInstance'
const Security = () => {
    // const [currentPassword, setCurrentPassword] = useState('')
    // const [newPassword, setNewPassword] = useState('')
    // const [confirmPassword, setConfirmPassword] = useState('')



    const [form] = Form.useForm()

    const onFinish = async (requestChangePassword) => {
        console.log(requestChangePassword)
        try {
            const response = await axiosInstance.put('/user/pwd', {
                currentPassword: requestChangePassword['currentPassword'],
                newPassword: requestChangePassword['newPassword'],
                confirmPassword: requestChangePassword['confirmPassword'],
            })
            notification.success({
                message: 'Chang password successfully',
                duration: 2,
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Change password failure',
                description: error.response.data.message,
                duration: 2,
            })
        }
    }

    return (
        <div>
            <Row align="middle" justify="center">
                <Col>
                    <Form
                        name="change_password"
                        onFinish={onFinish}
                        layout="vertical"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '37.5%',
                            transform: 'scale(1.25)',
                        }}
                    >
                        <Form.Item
                            name="currentPassword"
                            label="Current Password"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please input your current password!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Current Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="New Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            dependencies={['newPassword']}
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please confirm your new password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue('newPassword') ===
                                                value
                                        ) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(
                                            new Error(
                                                'The two passwords that you entered do not match!'
                                            )
                                        )
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm New Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Change Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default Security
