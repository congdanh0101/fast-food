import { useDispatch } from 'react-redux'
import request from '../../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'
import {
    createUser,
    registerUser,
    verifyRegisterUser,
} from '../../redux/apiRequest'

import { LoadingOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import './Email.css'
const { useState, useEffect } = require('react')
const Email = () => {
    const [code, setCode] = useState('')
    const [message, setMessage] = useState(null)
    // const [submit, setSubmit] = useState(true)
    // const [resend, setResend] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [remainingTime, setRemainingTime] = useState(5)
    const [form] = Form.useForm()

    useEffect(() => {
        if (remainingTime > 0) {
            const intervalId = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1)
            }, 1000)

            return () => {
                clearInterval(intervalId)
            }
        }
    }, [remainingTime])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCode(form.getFieldValue('code'))
        verifyRegisterUser(form.getFieldValue('code'), dispatch, navigate)
        // const now = new Date().getTime()
        // const expired = localStorage.getItem('expired')
        // const user = JSON.parse(localStorage.getItem('user'))
        // const verificationCode = localStorage.getItem('code')
        // if (now > expired) {
        //     console.log(`Token is expired`)
        //     setMessage(`Token is expired`)
        // } else {
        //     if (code !== verificationCode) setMessage('Invalid code')
        //     else createUser(user,dispatch,navigate)
        // }
    }

    const handleResend = async (e) => {
        e.preventDefault()
        setRemainingTime(5)
        const register = localStorage.getItem('registerUser')
        const user = register ? JSON.parse(register) : null
        registerUser(user, dispatch, navigate)
    }

    return (
        <div>
            {/* <form onSubmit={handleSubmit}>
                <label>EMAIL VERIFICATION CODE</label>
                <input
                    type="text"
                    placeholder="your email verification code"
                    onChange={(e) => setCode(e.target.value)}
                />
                <h3>{message}</h3>
                <button type="submit">submit</button>
            </form> */}

            <Row justify="center" align="middle">
                <Col>
                    <Form
                        form={form}
                        layout="vertical"
                        style={{
                            marginTop: '50%',
                            transform: 'scale(2)',
                        }}
                    >
                        <Form.Item style={{ flex: '1' }} name="code">
                            <Input placeholder="Verification code" />
                        </Form.Item>
                        <Form.Item>
                            {remainingTime > 0 ? (
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            onClick={handleSubmit}
                                        >
                                            Xác nhận
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled
                                            style={{ width: 90 }}
                                        >
                                            <LoadingOutlined
                                                style={{
                                                    marginRight: '50%',
                                                    fontSize: '1rem',
                                                }}
                                            />
                                            {remainingTime}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled
                                        >
                                            Xác nhận
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            onClick={handleResend}
                                        >
                                            Gửi lại mã
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default Email
