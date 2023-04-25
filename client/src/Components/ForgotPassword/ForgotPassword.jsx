import { Button, Col, Form, Input, Row, notification } from 'antd'
import { useState } from 'react'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import request from '../../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [form] = Form.useForm()

    const navigate = useNavigate()

    const handleSubmit = async () => {
        localStorage.setItem('email', email)
        try {
            const response = await request.post('/auth/forgot', {
                email: email,
            })
            navigate('/verify/forgot')
        } catch (error) {
            notification.error({
                message:'Error',
                description:error.response.data.message
            })
        }
    }

    return (
        <div>
            <Row justify="center" align="middle">
                <Col>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        style={{ transform: 'scale(1.5)', marginTop: '50%' }}
                    >
                        <Form.Item
                            style={{ width: '100%' }}
                            name="email"
                            label="Email address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your email address',
                                },
                                {
                                    type: 'email',
                                    message:
                                        'Please enter a valid email address',
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email Address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ForgotPassword
