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
                message: 'Đổi mật khẩu thành công',
                duration: 2,
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Đổi mật khẩu thất bại',
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
                            label="Mật khẩu hiện tại"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Hãy nhập mật khẩu hiện tại!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu hiện tại"
                            />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy nhập mật khẩu mới!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu mới"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            dependencies={['newPassword']}
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Hãy xác nhận mật khẩu mới!',
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
                                                'Mật khẩu không khớp!'
                                            )
                                        )
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Xác nhận mật khẩu mới"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default Security
